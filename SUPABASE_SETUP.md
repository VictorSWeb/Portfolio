# Configuração do formulário de contato

O formulário da página `contact.html` fica desativado até receber a URL pública da função. Nenhum projeto Supabase ou Resend foi criado, configurado ou implantado por este repositório. Não há credenciais no código.

## Arquitetura

1. O navegador envia nome, e-mail, assunto, mensagem, consentimento e um UUID de idempotência para uma Supabase Edge Function.
2. A função valida a origem, o tamanho e os campos; rejeita o campo honeypot preenchido e aplica limite de cinco mensagens por hora por endereço de e-mail normalizado.
3. Uma função SQL registra a solicitação de forma atômica. A chave UUID evita a criação de duplicatas para uma mesma tentativa, e um bloqueio transacional serializa o limite por endereço.
4. A Edge Function envia uma notificação de texto ao endereço configurado no Resend e registra somente o estado da notificação. Uma falha de e-mail não apaga uma solicitação já salva e não é apresentada como envio confirmado. O estado `failed` deve ser verificado e tratado pelo operador; o mesmo UUID não dispara uma segunda notificação automaticamente.
5. A tabela não permite acesso de visitantes. RLS está habilitado, não há políticas públicas e a chave `service_role` é usada somente no servidor.

O endpoint é público por natureza e usa `verify_jwt = false`; isso não é autenticação. CORS, validação, honeypot e limite por e-mail reduzem abuso básico, mas não substituem proteção gerenciada contra tráfego malicioso. Nenhum endereço IP é gravado pela aplicação.

## Pré-requisitos externos

- Um projeto Supabase configurado por você e o Supabase CLI disponível.
- Uma conta Resend com um domínio de remetente verificado.
- A URL de produção correta do site.

Durante a auditoria, `https://victorsweb.github.io/Portfolio/` serviu a versão anteriormente publicada do portfólio; esta remodelagem ainda não foi publicada. A API pública do GitHub informa que Pages está habilitado, e o README histórico do TaskFlow também aponta para esse endereço. Em contrapartida, o campo `homepage` do repositório aponta para `https://portfolio-victor-sw-eb.vercel.app`, que redirecionou para o login da Vercel. Não há um `CNAME`, workflow de publicação ou configuração de hospedagem versionada que resolva essa divergência. GitHub Pages é a única URL pública ativa confirmada nesta auditoria, e as URLs canônicas atuais usam esse endereço; o campo `homepage` continua precisando de revisão pelo responsável do repositório. Antes de habilitar o formulário, confirme o domínio no painel e atualize as URLs canônicas, o sitemap, `SITE_ORIGIN`, a política de privacidade e `contact-config.js` se a origem mudar.

## Publicação do site estático

O portfólio principal não tem framework, etapa de build ou dependências de pacote na raiz. Os HTML, CSS, JavaScript, imagens e arquivos de metadados são publicados diretamente pela configuração atual do GitHub Pages no caminho `/Portfolio/`. Não há configuração de hospedagem versionada aqui; não assuma que este repositório alterou domínio, regras de publicação ou acesso público. O arquivo `robots.txt` fica no caminho do projeto e não no caminho raiz do host (`https://victorsweb.github.io/robots.txt`); para publicar um robots.txt padrão será necessário configurar o repositório de site do usuário ou um domínio próprio. O sitemap do projeto pode ser consultado em `https://victorsweb.github.io/Portfolio/sitemap.xml`.

## Instalar a migração

1. Crie o projeto Supabase e obtenha o project ref. Não copie a chave `service_role` para arquivos do site ou para o navegador.
2. No diretório raiz deste repositório, vincule o CLI e aplique a migração:

   ```powershell
   supabase login
   supabase link --project-ref <PROJECT_REF>
   supabase db push
   ```

3. Confirme que `public.contact_submissions` existe, que RLS está habilitado e que as funções SQL `submit_contact_submission` e `purge_expired_contact_submissions` foram criadas. A tabela não deve ter políticas para `anon` ou `authenticated`.

## Configurar a retenção de 12 meses

A migração inclui uma função de descarte, mas não agenda tarefas automaticamente. Antes de coletar mensagens reais:

1. Habilite a extensão `pg_cron` no painel Supabase.
2. No SQL Editor como administrador, crie ou substitua a tarefa diária:

   ```sql
   select cron.unschedule(jobid)
   from cron.job
   where jobname = 'contact-submissions-retention';

   select cron.schedule(
       'contact-submissions-retention',
       '17 3 * * *',
       'select public.purge_expired_contact_submissions();'
   );
   ```

3. Verifique em `cron.job` que a tarefa está ativa e monitore suas execuções. Sem essa tarefa, os registros permanecem no banco até serem removidos manualmente; a retenção não é automática.

## Configurar segredos e implantar a função

1. Copie `supabase/.env.example` para `supabase/.env.local` e substitua os valores de exemplo. `.env.local` está ignorado pelo Git:

   ```powershell
   Copy-Item supabase/.env.example supabase/.env.local
   ```

2. `CONTACT_EMAIL_FROM` deve ser um remetente verificado no Resend. `CONTACT_EMAIL_TO` é o endereço que receberá a notificação. `SITE_ORIGIN` deve ser apenas a origem HTTPS, sem caminho ou barra final.
3. O Supabase injeta `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente da função. Não os adicione a `contact-config.js`, HTML, JavaScript público ou ao Git.
4. Envie somente os demais valores como segredos do projeto e implante a função:

   ```powershell
   supabase secrets set --env-file supabase/.env.local
   supabase functions deploy contact --no-verify-jwt
   ```

5. Configure a URL pública da Edge Function em `contact-config.js`, por exemplo:

   ```js
   window.PORTFOLIO_CONTACT_ENDPOINT = "https://<PROJECT_REF>.supabase.co/functions/v1/contact";
   ```

   Essa URL não é uma credencial. Não inclua chaves Supabase ou Resend no arquivo.

6. Publique o site pelo fluxo de hospedagem que você já utiliza. A função permite a origem definida por `SITE_ORIGIN` e, para desenvolvimento local, `http://localhost:8000` e `http://127.0.0.1:8000`.

## Verificação após configuração

1. Sirva o site localmente com `python -m http.server 8000` e confirme que o formulário continua desativado quando o endpoint está vazio.
2. Depois de implantar a função, verifique a URL configurada e envie uma mensagem de teste não sensível a partir da origem autorizada.
3. Confirme a resposta no formulário, a linha correspondente no Supabase, o estado de notificação e a chegada do e-mail no Resend.
4. Teste novamente a mesma tentativa com o mesmo UUID para confirmar que não cria um segundo registro nem envia outra notificação.
5. Verifique a resposta 429 depois de exceder cinco solicitações dentro de uma hora para o mesmo e-mail de teste.
6. Nunca compartilhe ou registre corpos de mensagens de teste com dados pessoais reais.

Este repositório não realiza deploy, não executa uma chamada real ao Resend e não comprova a configuração de qualquer serviço externo.
