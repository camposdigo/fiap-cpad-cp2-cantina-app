# Checkpoint 2 - Cross-Platform Application Development

## Cantina FIAP

Aplicativo mobile desenvolvido com Expo e React Native para simular pedidos antecipados em uma cantina universitária. A proposta é reduzir filas no intervalo, permitindo consultar itens do cardápio, filtrar por categoria, buscar produtos e montar um pedido com total calculado em tempo real.

## Integrantes

| Nome | RM | GitHub |
| --- | --- | --- |
| Rodrigo Campos Cordeiro | RM000000 | [@rodrigo-campos-cordeiro](https://github.com/rodrigo-campos-cordeiro) |

> Atualize esta tabela com todos os membros do grupo antes da entrega final.

## Nome do Repositório

O repositório deve ser público e seguir o padrão:

```text
fiap-cpad-cp2-cantina-app
```

## Funcionalidades

- Listagem de produtos do cardápio.
- Busca por nome ou descrição do produto.
- Filtro por categorias: todos, lanches, bebidas e saudáveis.
- Adição de itens ao pedido.
- Remoção e incremento de quantidades no carrinho.
- Cálculo automático do valor total em reais.
- Interface responsiva para execução em dispositivos móveis via Expo.

## Tecnologias

- Expo
- React Native
- TypeScript
- React Hooks
- Expo Vector Icons

## Como Executar

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npx expo start
```

Depois, escolha uma das opções exibidas pelo Expo:

- Abrir no aplicativo Expo Go pelo QR Code.
- Executar em emulador Android.
- Executar em simulador iOS.
- Executar no navegador com a opção web, caso configurada no ambiente.

## Estrutura do Projeto

```text
.
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## Decisões de Implementação

A aplicação foi construída em um único arquivo principal para manter a entrega objetiva e fácil de avaliar. Os dados do cardápio estão em memória, o que permite testar todos os fluxos sem depender de API externa.

O estado do carrinho usa um objeto indexado pelo identificador do produto. Essa escolha simplifica a soma de quantidades e evita duplicidade de itens no pedido.

## Critérios de Entrega Atendidos

- Projeto Expo configurado para rodar com `npx expo start`.
- README com descrição, tecnologias, funcionalidades e instruções de execução.
- Nome do projeto alinhado ao padrão `fiap-cpad-cp2-[nome-do-app]`.
- Interface funcional com fluxo de busca, filtro, seleção e pedido.

## Boas Práticas para a Entrega no GitHub

- Manter a branch `main` com a versão funcional mais recente.
- Usar commits descritivos, por exemplo:

```text
feat: cria tela inicial da cantina
feat: adiciona filtros de categorias
docs: atualiza instrucoes do README
```

- Garantir que cada integrante tenha commits relevantes no histórico.
- Conferir a execução local antes de enviar:

```bash
npm install
npx expo start
```

