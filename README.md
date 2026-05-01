# Checkpoint 2 - Cross-Platform Application Development

## Cantina FIAP

Aplicativo mobile desenvolvido com Expo, React Native e Expo Router para antecipar pedidos na cantina universitária. A operação escolhida foi a retirada de lanches no intervalo, porque é um fluxo comum no campus e costuma gerar fila em horários de pico.

O CP2 evolui o MVP do CP1 com autenticação local, sessão persistida, carrinho salvo no dispositivo, histórico de pedidos, navegação protegida, validação de formulários e melhoria visual nas telas principais.

## Integrantes

| Nome | RM | GitHub |
| --- | --- | --- |
| Rodrigo Campos Cordeiro | RM000000 | [@rodrigo-campos-cordeiro](https://github.com/rodrigo-campos-cordeiro) |

> Atualize esta tabela com todos os integrantes do grupo antes da entrega.

## Funcionalidades

- Cadastro de usuário com nome completo, e-mail, senha e confirmação de senha.
- Login validando credenciais persistidas no AsyncStorage.
- Sessão persistida: usuário logado continua autenticado ao reabrir o app.
- Logout com limpeza da sessão local.
- Navegação protegida: telas do app só abrem para usuários autenticados.
- Cardápio com produtos, preço, descrição e tempo de preparo.
- Busca e filtragem em tempo real por texto e categoria.
- Carrinho com adição, remoção e incremento de quantidade.
- Persistência do carrinho com AsyncStorage.
- Confirmação de pedido e histórico persistido.
- Tela de lista vazia para busca sem resultado e histórico sem pedidos.
- Feedback visual de loading, sucesso e erros inline.
- Interface visual inspirada no portal da FIAP, com fundo escuro, rosa institucional e componentes lineares.

## Tecnologias

- Expo SDK 52
- React Native
- TypeScript
- Expo Router
- Context API
- AsyncStorage
- Expo Vector Icons

## Como Rodar

Pré-requisitos:

- Node.js instalado
- npm instalado
- Expo Go no celular ou emulador Android/iOS configurado

Passo a passo:

```bash
git clone https://github.com/usuario/fiap-cpad-cp2-cantina-app
cd fiap-cpad-cp2-cantina-app
npm install
npx expo start
```

Depois, abra o app pelo QR Code no Expo Go ou pelo emulador.

## Estrutura de Pastas

```text
.
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── cadastro.tsx
│   │   └── login.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── pedidos.tsx
│   │   └── perfil.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── components/
│   ├── Button.tsx
│   ├── EmptyState.tsx
│   └── Input.tsx
├── constants/
│   └── theme.ts
├── context/
│   ├── AppDataContext.tsx
│   └── AuthContext.tsx
├── data/
│   └── products.ts
├── types/
│   └── app.ts
└── utils/
    └── format.ts
```

## Context API

### AuthContext

Gerencia o fluxo de autenticação:

- usuário logado
- loading de sessão
- cadastro
- login
- logout
- mensagem de sucesso

### AppDataContext

Gerencia os dados funcionais do app:

- carrinho
- histórico de pedidos
- adição e remoção de itens
- confirmação de pedido
- limpeza do carrinho

## AsyncStorage

Chaves utilizadas:

```text
@cantina_fiap:users
@cantina_fiap:session
@cantina_fiap:cart
@cantina_fiap:orders
```

Os usuários cadastrados ficam em `@cantina_fiap:users`. A sessão ativa fica em `@cantina_fiap:session`, permitindo que o app lembre o login. O carrinho e o histórico ficam em `@cantina_fiap:cart` e `@cantina_fiap:orders`, sobrevivendo ao fechamento do aplicativo.

## Navegação Protegida

O projeto usa Expo Router com dois grupos de rotas:

- `(auth)`: login e cadastro.
- `(tabs)`: cardápio, pedidos e perfil.

Se não houver usuário logado, o layout de `(tabs)` redireciona para `/login`. Se já houver sessão ativa, o layout de `(auth)` redireciona para as telas principais.

## Validações

Os formulários mostram erros inline, abaixo do campo correspondente:

- campo obrigatório
- e-mail em formato inválido
- senha com menos de 6 caracteres
- confirmação de senha divergente
- credenciais inválidas no login

O botão de submissão fica desabilitado quando há erros.

## Diferencial Implementado

O diferencial escolhido foi **busca e filtragem em tempo real**.

Justificativa: em uma cantina, o usuário quer encontrar rapidamente o produto no intervalo. A busca por texto combinada com categorias reduz o tempo de navegação, melhora a experiência e deixa o app mais útil em um cenário real de fila.

Resumo técnico: a tela de cardápio usa `useMemo` para recalcular a lista a partir do texto digitado e da categoria selecionada, renderizando os resultados com `FlatList`.

## Demonstração Visual

Adicione os prints finais antes da entrega:

| Tela | Arquivo sugerido |
| --- | --- |
| Login | `docs/screenshots/login.png` |
| Cadastro | `docs/screenshots/cadastro.png` |
| Cardápio | `docs/screenshots/cardapio.png` |
| Pedidos | `docs/screenshots/pedidos.png` |
| Perfil | `docs/screenshots/perfil.png` |

Adicione também um GIF ou vídeo demonstrando o fluxo:

```text
cadastro -> login -> adicionar item -> confirmar pedido -> visualizar pedidos -> logout
```

Link do vídeo/GIF:

```text
Adicionar link aqui
```

## Próximos Passos

- Separar senha de usuário de forma mais segura.
- Adicionar foto de perfil com ImagePicker.
- Permitir observações no pedido.
- Criar status de preparo e retirada.

## Requisitos de Entrega

- Repositório público.
- Nome do repositório: `fiap-cpad-cp2-cantina-app`.
- Branch `main` com a versão funcional mais recente.
- Commits descritivos e relevantes por integrante.
- Projeto executando com `npx expo start`.
