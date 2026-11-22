create table if not exists public.contact_submissions (
    id uuid primary key,
    name text not null check (char_length(btrim(name)) between 1 and 100),
    email text not null check (char_length(email) between 3 and 254),
    subject text not null check (
        subject in (
            'Oportunidade profissional',
            'Projeto',
            'Colaboração',
            'Outro assunto'
        )
    ),
    message text not null check (char_length(btrim(message)) between 20 and 5000),
    consent boolean not null check (consent),
    consented_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    notification_status text not null default 'pending'
        check (notification_status in ('pending', 'sent', 'failed'))
);

create index if not exists contact_submissions_email_created_at_idx
    on public.contact_submissions (email, created_at desc);

alter table public.contact_submissions enable row level security;

revoke all on table public.contact_submissions from public, anon, authenticated;
grant select, insert, update, delete on table public.contact_submissions to service_role;

create or replace function public.submit_contact_submission(
    p_id uuid,
    p_name text,
    p_email text,
    p_subject text,
    p_message text,
    p_consent boolean
)
returns table (result text, notification_status text)
language plpgsql
security definer
set search_path = ''
as $$
declare
    normalized_email text := pg_catalog.lower(pg_catalog.btrim(p_email));
    recent_submission_count bigint;
    existing_status text;
begin
    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(p_id::text, 1)
    );

    select submission.notification_status
      into existing_status
      from public.contact_submissions as submission
     where submission.id = p_id;

    if found then
        return query select 'duplicate'::text, existing_status;
        return;
    end if;

    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(normalized_email, 0)
    );

    select pg_catalog.count(*)
      into recent_submission_count
      from public.contact_submissions as submission
     where submission.email = normalized_email
       and submission.created_at >= pg_catalog.now() - interval '1 hour';

    if recent_submission_count >= 5 then
        return query select 'rate_limited'::text, null::text;
        return;
    end if;

    insert into public.contact_submissions (
        id,
        name,
        email,
        subject,
        message,
        consent,
        consented_at
    )
    values (
        p_id,
        pg_catalog.btrim(p_name),
        normalized_email,
        p_subject,
        pg_catalog.btrim(p_message),
        p_consent,
        pg_catalog.now()
    );

    return query select 'created'::text, 'pending'::text;
end;
$$;

revoke all on function public.submit_contact_submission(uuid, text, text, text, text, boolean)
    from public, anon, authenticated;
grant execute on function public.submit_contact_submission(uuid, text, text, text, text, boolean)
    to service_role;

create or replace function public.purge_expired_contact_submissions()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
    deleted_count bigint;
begin
    delete from public.contact_submissions
     where created_at < pg_catalog.now() - interval '12 months';

    get diagnostics deleted_count = row_count;
    return deleted_count;
end;
$$;

revoke all on function public.purge_expired_contact_submissions()
    from public, anon, authenticated;
grant execute on function public.purge_expired_contact_submissions()
    to service_role;
