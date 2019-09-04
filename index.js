const WebSocket = require('ws')
const escpos = require('escpos');
const wss = new WebSocket.Server({ port: 9999 })

wss.on('connection', ws => {
  ws.on('message', message => {
    const device  = new escpos.USB();
    const options = { encoding: "GB18030" /* default */ }
    const printer = new escpos.Printer(device, options);

    device.open(function(){
      printer.buffer.write(message)

      printer
      .font('a')
      .align('ct')
      .style('bu')
      .size(1, 1)
      .text('The quick brown fox jumps over the lazy dog')
      .text('敏捷的棕色狐狸跳过懒狗')
      .barcode('1234567', 'EAN8')
      .table(["One", "Two", "Three"])
      .tableCustom([ 
        { text:"Left", align:"LEFT", width:0.33 },
        { text:"Center", align:"CENTER", width:0.33},
        { text:"Right", align:"RIGHT", width:0.33 }
      ]) 
      .qrimage('https://github.com/song940/node-escpos', function(err){
        this.cut();
        this.close();
      });
    });

  })
  ws.send('ho!')
})
