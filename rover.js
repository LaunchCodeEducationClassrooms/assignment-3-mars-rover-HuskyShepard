class Rover{
  constructor(position){
    this.position = position;
    this.mode = 'NORMAL';
    this.generatorWatts = 110;
  }

  receiveMessage(message){
    let results = []
    for(let i = 0;i<message.commands.length;i++)
    {
      if (message.commands[i].commandType === 'MOVE' && this.mode === 'LOW_POWER') {
        results.push({
          completed:false
        })
      } else if (message.commands[i].commandType === 'MOVE') {
        results.push({
          completed: true
        })
        this.position = message.commands[i].value;
      } 
      if (message.commands[i].commandType === 'STATUS_CHECK') {
        results.push({
          completed: true,
          roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
          }
        })
      }
      if (message.commands[i].commandType === 'MODE_CHANGE') {
        results.push({
          completed: true
        })
        this.mode = message.commands[i].value;
      } 
    }
    
    return{
      message:message.name,
      results : results
    }  
  }
};
module.exports = Rover;