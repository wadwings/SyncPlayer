import { useState } from "react";
import Input from "@mui/material/Input";
// import reactLogo from './assets/react.svg'
import "./VideoPlayer.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import eventbus from "../EventBus";


interface scope {
  ws?: WebSocket | null;
  state?: "leader" | "follower";
  interval?: number;
}

interface ConnectionType {
  type: "connection" | "sync";
  state?: "leader" | "follower";
  playState?: PlayStatus;
}

interface PlayStatus {
  valid: boolean;
  isPaused: boolean;
  currentTime: number;
  src: string;
}

const obj: scope = {
  state: 'follower'
};

function App() {
  // const [count, setCount] = useState(0)
  const [playSource, setPlaySource] = useState(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  );
  const [connectionState, setConnectionState] = useState(false);

  const throttle = (fn: (...args: any[]) => void) => {
    let timer = 0;
    return (...args: any[]) => {
      if (timer !== 0) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => fn(...args), 1000);
    };
  };

  const textChange = throttle((value: string | null) => {
    if (typeof value === "string") {
      setPlaySource(value);
    }
  });

  const connect = async () => {
    const target = document.getElementById("roomid");
    let roomid: string;
    if (target instanceof HTMLInputElement) {
      // fetch('')
      roomid = target.value;
    }
    const ws = new WebSocket("ws://localhost:8080");
    obj.ws = ws;
    ws.onopen = (e: Event) => {
      setConnectionState(true);
      eventbus.emit('success', 'successfully connect to ws://localhost:8080')
      ws.send(
        JSON.stringify({
          event: "connect",
          data: roomid,
        })
      );
    };

    ws.onmessage = (e) => {
      const data: ConnectionType = JSON.parse(e.data);
      const { type, state, playState } = data;
      // console.log(data);
      if (type === "connection") {
        console.log(`this is ${state}`)
        if (obj.state !== 'leader' && state === "leader") {
          eventbus.emit('info', 'this is leader')
          obj.state = state
          const interval = setInterval(
            () =>
              ws.send(
                JSON.stringify({
                  event: "sync",
                  data: {
                    id: roomid,
                    data: generatePlayState(),
                  },
                })
              ),
            5000
          );
          obj.interval = interval;
        } 
      }
      if (obj.state === "follower" && type === "sync" && playState) {
        setPlayState(playState);
      }
    };
  };


  const generatePlayState = (): PlayStatus => {
    const player = document.getElementById("player");
    if (player instanceof HTMLVideoElement) {
      // console.log(player);
      const { paused, currentTime, currentSrc } = player;
      return {
        valid: true,
        isPaused: paused,
        currentTime: currentTime,
        src: currentSrc,
      };
    }
    return {
      valid: false,
      isPaused: false,
      currentTime: 0,
      src: "",
    };
  };

  const setPlayState = (state: PlayStatus) => {
    // console.log(`receiving setting ${state}`);
    const player = document.getElementById("player");
    const { valid, isPaused, currentTime, src } = state;
    if (player instanceof HTMLVideoElement && valid) {
      // console.log(player)
      if (src !== player.currentSrc) {
        eventbus.emit('info', `switch src to ${src}`)
        player.currentTime = currentTime;
        player.src = src;
      }
      if (Math.abs(currentTime - player.currentTime) > 5) {
        eventbus.emit('info', `jump to ${currentTime.toFixed(2)}s`)
        player.currentTime = currentTime;
      }
      if (player.paused !== isPaused) {
        eventbus.emit('info', `change play state`)
        // console.log('test')
        player.paused ? player.play() : player.pause();
      }
    }
  };

  const disconnect = () => {
    const ws = obj.ws;
    if (ws instanceof WebSocket) {
      console.log(`disconnect from ${ws.url}`)
      ws.close();
      ws.onmessage = null
      if (obj.interval) {
        clearInterval(obj.interval)
        obj.interval = 0
      }
      eventbus.emit('success', 'successfully disconnect from ws://localhost:8080')
      setConnectionState(false);
    }
  }


  return (
    <div className="container">
      {/* <Input></Input> */}
      <TextField
        className="textInput"
        id="filled-basic"
        label="link"
        variant="filled"
        defaultValue={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}
        onChange={(e) => {
          textChange(e.target.value);
        }}
      />
      <div className="buttonFlex">
        <TextField
          required
          id="roomid"
          label="Play Room ID"
          defaultValue="1234abcd"
        />
        <Button variant="outlined" onClick={connectionState ? disconnect : connect}>
          {connectionState ? "Disconnect" : "Connect"}
        </Button>
      </div>
      <video
        id="player"
        className="videoPlayer"
        src={playSource}
        controls
      ></video>
    </div>
  );
}

export default App;
