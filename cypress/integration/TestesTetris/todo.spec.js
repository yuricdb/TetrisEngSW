/// <reference types="cypress" />

const  teclas = ['{uparrow}','{downarrow}','{leftarrow}','{rightarrow}']


//Preciso descobrir como fazer o cypress digitar o nome do jogador
describe('Teste Jogo Tetris', () => {
  it('Verificando Todos os Botões', () => {

    cy.visit('/')
    cy.get('#onOff-button').click();
    cy.wait(3000)
    cy.get('#sound-button').click();
    cy.wait(3000)
    cy.get('#start-button').click();
    cy.wait(3000)
    cy.get('#reset-button').click();
    cy.wait(3000)
  })

  it('Verificando Movimento das Peças', () => {

    cy.visit('/')
    cy.get('#onOff-button').click();
    cy.wait(1000)
    cy.get('#start-button').click();
    cy.wait(1000)
    for(let passo = 0; passo < 20; passo++){
      cy.get('body').type(teclas[parseInt(Math.random()*4)])
      cy.wait(1000)
    }   
  }) 

  it('Verificando o GameOver', () => {

      cy.visit('/')
      cy.get('#onOff-button').click();
      cy.wait(1000)
      cy.get('#start-button').click();
      cy.wait(1000)
      for(let passo = 0; passo < 70; passo++){
        cy.get('body').type(teclas[1])       
      } 
      cy.get('#score').contains('span', 'end');
      cy.get('#level').contains('span', 'end');
  })
  })
 //Sugestão de Teste: Parar e Retornar Jogo, Reiniciar com video game desligado, Parar e Retornar Som, Tentar movimentar com jogo Pausado