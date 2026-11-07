# TaskFlow

Aplicação de gerenciamento de tarefas construída com React, TypeScript e Vite.

## Executar localmente

```sh
npm install
npm run dev
```

## Recursos

- Criar, editar, excluir e atualizar o status das tarefas.
- Definir descrição, prioridade e prazo opcional.
- Pesquisar título e descrição, combinar filtros de status e prioridade e ordenar resultados.
- Acompanhar os totais por status no painel.
- Persistir tarefas no LocalStorage do navegador (`taskflow.tasks.v1`).

As tarefas são locais ao navegador e não são sincronizadas entre dispositivos. Se os dados salvos estiverem inválidos, a aplicação informa o problema e inicia uma lista vazia.

## Verificação

```sh
npm run build
npm run lint
```
