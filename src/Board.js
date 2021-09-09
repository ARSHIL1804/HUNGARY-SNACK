import React, { useState,useEffect,Component} from 'react'
import './board.css'
import useInterval from './useInterval'


const direction={
  UP:'UP',RIGHT:'RIGTH',LEFT:'LEFT',DOWN:'DOWN'
}

const BOARD_SIZE=10

function search(state,cellVal){
  for(let i=0;i<state.length;i++){
    if(state[i].cell==cellVal)return true;
  }
  return false
}


export default class Board extends Component {
    constructor(){
    super()
    this.state={
      score:0,
      board:Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill()),
      snake:[],
      foodCell:{cell:82},
      direction:'DOWN',
      gameOver:0,
      msg:"",
      directionChanged:false
    }
    this.handleKeyDOWN = this.handleKeyDOWN.bind(this)
    this.moveSnakeAutomatically=this.moveSnakeAutomatically.bind(this)
  }
  handleKeyDOWN(event){
    if(this.state.gameOver==1 && event.keyCode==32){
      this.resetGame();
      return 
    }
    if(this.state.directionChanged) return;
    switch (event.keyCode) {
      case 37:
      case 65:
        this.goLEFT()
        break
      case 38:    
      case 87:
        this.goUP()
        break
      case 39:
      case 68:
        this.goRIGHT()
        break
      case 40:
      case 83:
        this.goDOWN()
        break
      default:
    }
    this.setState({directionChanged:true})
  }
  componentDidMount(){
    console.log("BEFORE")
    this.createBoard()
    this.intializeSnake();
    console.log("MIDDLE")
    window.addEventListener('keydown', this.handleKeyDOWN);
    this.gameLoop();
  }
  gameLoop(){
      setTimeout(() => {
        if(this.state.gameOver==0){
        this.moveSnakeAutomatically()
        this.eatFood();
        this.setState({ directionChanged: false })
        }
        this.gameLoop();
      }, 200);
  }
  eatItself(tmp){
    for(let i=1;i<tmp.length;i++){
      if(tmp[0] == tmp[i]){
       let snake=[]
       console.log("ebfrg")
       this.setState({
         snake:snake
       })
      }
    }
  }
  createBoard = () => {
    let counter=1;
    for (let row = 0; row < BOARD_SIZE; row++) {
         for (let col = 0; col < BOARD_SIZE; col++) {
              this.state.board[row][col]=counter++;
          }
    }
   };
  intializeSnake = ()=>{
    let row= Math.round(this.state.board.length / 3);
    let col= Math.round(this.state.board[0].length / 3);
    let cell= Math.round(this.state.board[row][col]);
    let TmpSnake=[];
    TmpSnake.push({row,col,cell});
    TmpSnake.push({row:row-1,col:col,cell:cell-10})
    TmpSnake.push({row:row-2,col:col,cell:cell-20})
    this.setState({
      snake:TmpSnake
    })
  };
  getClassname =(snake,foodCell,cellVal)=>{
    if(foodCell===cellVal){
      return 'cell foodcell'
    }
    else if(search(snake,cellVal)){
      return 'cell snakecell'      
    }
    else{
      return 'cell'
    }
 }  
  moveSnakeAutomatically=()=>{
    let dummy=this.state.snake;
    let preRow=dummy[0].row;
    let preCol=dummy[0].col;
    let tmpRow,tmpCol;
    this.moveHead();
    for(let i=1;i<dummy.length;i++){
      tmpRow=dummy[i].row;
      tmpCol=dummy[i].col;
      dummy[i].row=preRow;
      dummy[i].col=preCol;
      dummy[i].cell=this.state.board[dummy[i].row][dummy[i].col]
      preRow=tmpRow;
      preCol=tmpCol;
    }
    this.setState({state:dummy})
  }
  moveHead(){
    console.log();
    switch (this.state.direction) {
      case 'UP':
        this.moveUP()
        break;
      case 'DOWN':
          this.moveDOWN()
          break;
      case 'LEFT':
            this.moveLEFT()
            break;
      case 'RIGHT':
              this.moveRIGHT()
              break;
    }
  }
  
  moveUP(){
      let dummy=this.state.snake
      dummy[0].row -=1;
      dummy[0].cell-=10;
      this.checkDeath(dummy)
      this.setState({dummy})
  }
  moveDOWN(){
    let dummy=this.state.snake
      dummy[0].row +=1;
      dummy[0].cell+=10
      this.checkDeath(dummy)
      this.setState({dummy})
  }
  moveLEFT(){
    let dummy=this.state.snake
      dummy[0].col -=1;
      dummy[0].cell-=1 
      this.checkDeath(dummy)
      this.setState({snake:dummy})
     }
  moveRIGHT(){
    let dummy=this.state.snake
      dummy[0].col +=1;
      dummy[0].cell+=1
      this.checkDeath(dummy)
      this.setState({snake:dummy})
  }
  checkDeath(dummy){
     let row=dummy[0].row
     let col=dummy[0].col;
     if(row <0 || row>9  || col<0 || col>9 ){

         this.setState({gameOver:1,msg:"Touched One Of The Boundries"});
     }
     else if(row >=0 && row<=9  && col>=0 && col<=9) {
       for (let i=1;i<dummy.length;i++){
         if(dummy[0].cell == dummy[i].cell){
            this.setState({gameOver:1,msg:"Touched Youself"})
         }
       }
     }
  }
  eatFood(){
      let snake=this.state.snake;
      let food=this.state.foodCell;
    if(snake[0].cell==food.cell){
      snake.push(food)
      let newFood=Math.floor(Math.random() * (BOARD_SIZE*BOARD_SIZE))
      while(search(this.state.snake,newFood) && newFood !=food.cell){
        newFood=Math.floor(Math.random() * (BOARD_SIZE*BOARD_SIZE))
      }
      let foodCell={cell:newFood}
      this.setState({snake:snake,foodCell:foodCell,score:this.state.score+1})
    }
  }
  resetGame(){
    this.setState({
      score:0,
      board:Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill()),
      snake:[],
      foodCell:{cell:82},
      direction:'DOWN',
      gameOver:0,
      msg:""
    })
    this.createBoard()
    this.intializeSnake()
  }
  render() {
    let Render
    if(this.state.gameOver==0){ 
            Render=<div className="board">
            {this.state.board.map((row,rowIndex)=>(
                <div key={rowIndex} className="row">
                  {
                    row.map((cellVal,cellIndex)=>{
                      const className=this.getClassname(this.state.snake,this.state.foodCell.cell,cellVal)
                      return <div key={cellIndex} className={className}></div>;
                    })}
                </div>
             ))} 
          </div>
    }
    else{
      Render=<><h3>{this.state.msg}</h3><h1>GAME OVER </h1><h3>Click on spacebar to reset</h3></>
    }
    return (
      <>
      <h1>SCORE : {this.state.score}</h1>
      {Render}
     </>
    )
  }

  goLEFT() {
    let newDirection = this.state.direction === 'RIGHT' ? 'RIGHT' : 'LEFT'
    this.setState({ direction: newDirection })
  }

  goUP() {
    let newDirection = this.state.direction === 'DOWN' ? 'DOWN' : 'UP'
    this.setState({ direction: newDirection })
  }

  goRIGHT() {
    let newDirection = this.state.direction === 'LEFT' ? 'LEFT' : 'RIGHT'
    this.setState({ direction: newDirection })
  }

  goDOWN() {
    let newDirection = this.state.direction === 'UP' ? 'UP' : 'DOWN'
    this.setState({ direction: newDirection })
  }

}
