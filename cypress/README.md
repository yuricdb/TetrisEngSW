# Teste Cypress - Tetris


## Contexto Geral
Com o objetivo de aplicar alguns testes no jogo desenvolvido, foram realizadas simulações de ações que o usuário poderia fazer e também foram verificadas as respostas do software após os comandos dados pelo usuário.


## Testes Realizados
 - Ligar o videogame (Botão On/Off)
 - Iniciar a Partida (Botão Start/Stop)
 - Parar os sons (Botão Sound)
 - Reiniciar o Jogo (Botão Reset)
 - Movimentar as peças
 - Verificar tela do GameOver

 ## Dificuldades Encontradas
A principal dificuldade encontrada foi conseguir fazer com que os testes realizados com o Cypress conseguissem passar pelo 'alert' inicial do jogo, no qual é solicitado o preenchimento do nome do jogador. Depois de algumas pesquisas, a alternativa encontrada foi utilizar a função "stub". Esta função nos ajudou a permitir que para cada teste realizado, um novo nome de jogador fosse inserido e com isso todos os testes realizados no cypress ficassem totalmente automatizados.

