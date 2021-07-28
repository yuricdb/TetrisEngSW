/// <reference types="cypress" />

const  teclas = ['{uparrow}','{downarrow}','{leftarrow}','{rightarrow}']
const nomes = ['Yuri', 'Daniel', 'Victor'] //para cada um dos novos teste add, terá que ir add nomes aqui para entrar no alert, ex: 'giovanni', etc

describe('Teste Jogo Tetris', () => {
    beforeEach(function() { cy.visit('/')})
    
    it('Teste Botões - Alert', function(){
        cy.window().then(function($win){
            cy.viewport(1600,1080)
            cy.stub($win, 'prompt').returns(nomes[0])
            cy.get('#onOff-button').click();
            cy.wait(3000)
            cy.get('#sound-button').click();
            cy.wait(3000)
            cy.get('#start-button').click();
            cy.wait(3000)
            cy.get('#reset-button').click();
            cy.wait(3000)
        })

    })

    it('Teste Movimento das Peças - Alert', function(){
        cy.window().then(function($win){
            cy.viewport(1600,1080)
            cy.stub($win, 'prompt').returns(nomes[1])
            cy.get('#onOff-button').click()
            cy.get('#start-button').click()
            for(let passo = 0; passo < 20; passo++){
                cy.get('body').type(teclas[parseInt(Math.random()*4)])
                cy.wait(1000)
              } 
        })

    })

    it('Teste Game-Over - Alert', function(){
        cy.window().then(function($win){
            cy.viewport(1600,1080)
            cy.stub($win, 'prompt').returns(nomes[2])
            cy.get('#onOff-button').click()
            cy.wait(1000)
            cy.get('#start-button').click()
            cy.wait(1000)
            for(let passo = 0; passo < 70; passo++){
                cy.get('body').type(teclas[1])       
              } 
              cy.get('#score').contains('span', 'end');
              cy.get('#level').contains('span', 'end');
        })

    })

})