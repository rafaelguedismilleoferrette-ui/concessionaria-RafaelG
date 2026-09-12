# Concessionária

Formulário de cadastro de cliente da aula, utilizando Angular Material no lugar do PrimeNG.

O formulário mantém o título, o subtítulo, os campos e a disposição do projeto original, mas adicionando o UF:

- Primeira linha: nome, tipo de pessoa, CPF/CNPJ, telefone e CEP.
- Segunda linha: cidade, UF, endereço, bairro e número.
- Terceira linha: e-mail.
- Botões Salvar e Cancelar.

## Executar

Utilize Node.js 24 LTS (24.15 ou superior) e npm.

```bash
npm ci
npm start
```

## Funcionamento

Os campos são obrigatórios. O nome aceita de 3 a 50 caracteres. O formulário valida e-mail e quantidade de dígitos de CPF/CNPJ, telefone e CEP.

Salvar grava o cadastro no armazenamento local do navegador e apresenta uma mensagem. Cancelar limpa os campos. Os cadastros não são enviados para um servidor.
