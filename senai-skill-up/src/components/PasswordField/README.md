# Componente PasswordField

Um componente React reutilizável para campos de senha com funcionalidade de visualizar/ocultar a senha.

## Funcionalidades

- ✅ Campo de senha com ícone de cadeado
- ✅ Botão para visualizar/ocultar senha
- ✅ Ícone de olho que muda conforme o estado
- ✅ Estilização responsiva
- ✅ Suporte a ícones personalizados
- ✅ Validação de campos obrigatórios
- ✅ Acessibilidade com tooltips

## Como Usar

### Importação

```javascript
import PasswordField from '../../components/PasswordField';
```

### Uso Básico

```javascript
const [senha, setSenha] = useState('');

<PasswordField 
    placeholder="Digite sua senha"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
    required
/>
```

### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `placeholder` | string | - | Texto de placeholder do campo |
| `value` | string | - | Valor do campo (controlado) |
| `onChange` | function | - | Função chamada quando o valor muda |
| `required` | boolean | false | Se o campo é obrigatório |
| `className` | string | "" | Classes CSS adicionais |
| `icon` | string | "fas fa-lock" | Classe do ícone Font Awesome |

### Exemplos

#### Campo Padrão
```javascript
<PasswordField 
    placeholder="Senha"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
    required
/>
```

#### Campo com Ícone Personalizado
```javascript
<PasswordField 
    placeholder="Senha de acesso"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
    icon="fas fa-key"
/>
```

#### Campo Opcional
```javascript
<PasswordField 
    placeholder="Senha (opcional)"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
/>
```

## Estilização

O componente usa CSS customizado que pode ser sobrescrito. As principais classes são:

- `.input-field` - Container principal
- `.password-toggle` - Botão de visualizar/ocultar
- `.password-toggle:hover` - Estado hover do botão

## Ícones Disponíveis

O componente usa Font Awesome. Alguns ícones sugeridos:

- `fas fa-lock` (padrão)
- `fas fa-key`
- `fas fa-shield-alt`
- `fas fa-user-lock`

## Acessibilidade

- O botão tem um `title` que muda conforme o estado
- Suporte a navegação por teclado
- Ícones semânticos para leitores de tela

## Dependências

- React
- Font Awesome (já incluído no projeto)
