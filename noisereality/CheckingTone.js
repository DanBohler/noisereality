console.clear();


// UPDATE: there is a problem in chrome with starting audio context
//  before a user gesture. This fixes it.
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

var autoFilter = new Tone.AutoFilter("4n").toMaster().start();

autoFilter.baseFrequency.value = 200;

var freeverb = new Tone.Freeverb().toMaster();
freeverb.dampening.value = 200;
freeverb.roomSize.value = 500;
freeverb.wet.value = 1;

var pingPong1 = new Tone.PingPongDelay("8n", 0.3).toMaster();
var pingPong2 = new Tone.PingPongDelay("4n", 0.3).toMaster();
var pingPong3 = new Tone.PingPongDelay("2n", 0.4).toMaster();
var pingPong4 = new Tone.PingPongDelay("6n", 0.4).toMaster();

// var samplers = new Tone.Sampler({
// 	"C3" : "./../sounds/BassDrum.mp3",
// 	"D#3" : "./../sounds/SnareDrum.mp3",
// 	"F#3" : "./../sounds/CloseHat.mp3",
// })

// samplers[0].triggerAttack = "C3" ;
// samplers[1].triggerAttack = "C3" ;
// samplers[2].triggerAttack = "C3" ;

const synths = [
  new Tone.Synth().connect(pingPong2).connect(freeverb).connect(autoFilter),
  new Tone.Synth().connect(pingPong2).connect(freeverb).connect(autoFilter),
  new Tone.Synth().connect(pingPong3).connect(freeverb).connect(autoFilter),
  new Tone.Synth().connect(autoFilter)
];

synths[0].oscillator.type = 'sine';
synths[1].oscillator.type = 'sine2';
synths[2].oscillator.type = 'sine2';
synths[3].oscillator.type = 'sine';

const gain = new Tone.Gain(0.6);
gain.toMaster();

synths.forEach(synth => synth.connect(gain));

let divs = document.querySelectorAll("div")

const $rows = document.querySelectorAll(".synth"),
notes = ['G5', 'C5', 'F4', 'A2'];
let index = 0;
debugger

Tone.Transport.scheduleRepeat(repeat, '16n');
Tone.Transport.start();

function repeat(time) {
  let step = index % 16;
  for (let i = 0; i < $rows.length; i++) {
    let synth = synths[i],
    note = notes[i],
    $row = $rows[i],
    $input = $row.querySelector(`input:nth-child(${step + 1})`);
    if ($input.checked) synth.triggerAttackRelease(note, '8n', time);
  }
  index++;
}
