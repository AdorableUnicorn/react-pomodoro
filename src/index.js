import React from "react";
import ReactDOM from "react-dom/client";
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRepeat, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import myAudio from './sound.mp3'

function Button(value, id, action,clas,disabled=false) {
    return(
        <button
        type="button"
        className={clas}
        id={id}
        onClick={action}
        disabled={disabled}
        >
            {value}
        </button>
    )
}


class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: "session",
            session: 25,
            break: 5,
            minutes: 25,
            seconds: 0 ,
            timerId: null
        };
        this.resetTimer=this.resetTimer.bind(this);
        this.btnStartPause=this.btnStartPause.bind(this);
        this.calc_dashoffset=this.calc_dashoffset.bind(this);
    }
    componentDidMount() {
        this.audioPlayer = new Audio("./sound.mp3");
    }

    btnStartPause() {
        return !!this.state.timerId ? this.pauseTimer() : this.startTimer()
    }

    btnStartPauseValue() {
        return !!this.state.timerId ? <FontAwesomeIcon icon={faPause} size="lg"/> : <FontAwesomeIcon icon={faPlay} size="lg"/>
    }

    startTimer(){
        const newCurrentState = this.state.currentState == "session" ? "break" : "session" 
        if (!!this.state.timerId){
            this.setState({
                minutes: this.state[newCurrentState],
                currentState: newCurrentState,
                seconds: 0
            })    
        }
         
        const timerId = setInterval(() => {
            let {seconds, minutes} = this.state

            if (seconds>0){
                seconds--
            } else {
                if (minutes>0){
                    minutes--
                    seconds=59
                } else {
                    this.audioPlayer.play();
                    this.pauseTimer();
                    this.startTimer();
                    return
                }
            }
            this.setState({minutes,seconds});
        }, 1000)
        this.setState({timerId})
    }

    pauseTimer () {
        clearInterval(this.state.timerId)
        this.setState({
            timerId: null
        })
    }

    resetTimer(){
        clearInterval(this.state.timerId)
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.setState({
            currentState: "session",
            session:25,
            break:5,
            minutes:25,
            seconds:0,
            timerId:null
        })
    }

    count(action, stateType){
        const newStateTime = action === "-" ? this.state[stateType]-1 : this.state[stateType]+1
        const newMin = stateType == "session" ? newStateTime : this.state.minutes

        this.setState({
            [stateType] : newStateTime,
            minutes: newMin,
            seconds: 0
        })  
    }

    pad(val){
        return (val >= 10 || val==="00") ? val : "0"+val
    }

    calc_dashoffset(){
        const currentTime = this.state.minutes+"."+this.pad(Math.round(this.state.seconds*100/60));
        return (currentTime*(692/this.state[this.state.currentState]))
    }

    /*<progress value={this.state.minutes+"."+Math.round(this.state.seconds*100/60)} min="0" max={this.state[this.state.currentState]}></progress>*/
    render() {
        return (
            <div id="main-container">
                <div className="out">
                    <svg xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="240px"
                    height="240px"
                    id="svg_circle">
                        <defs>  
                            <linearGradient id="GradientColor">
                                <stop offset="0%"
                                stopColor="#518c8f" />
                                <stop offset="100%"
                                stopColor="#00ADB5" /> 
                            </linearGradient>
                        </defs>
                        <circle cx="120" cy="120" r="110" transform="rotate(-86 120 120)"
                        strokeLinecap="round" 
                        style={{strokeDashoffset: this.calc_dashoffset()}}/>
                    </svg>
                    <div className="in">
                        <div id="time-container" className="container">
                            <p id="timer-label" className="text">{this.state.currentState}</p>
                            <p id="time-left" className="text">{this.pad(this.state.minutes)}:{this.pad(this.state.seconds)}</p>
                            <div className="btn_section">
                                {Button(this.btnStartPauseValue(),"start_stop",(()=>this.btnStartPause()),"element")}
                                {Button(<FontAwesomeIcon icon={faRepeat} size="lg"/>,"reset",this.resetTimer,"element")}
                                <audio id="beep" src={myAudio} type="audio/mpeg" ref={(ref) => (this.audioPlayer = ref)} disableRemotePlayback={!!this.state.timerId}></audio>
                            </div> 
                        </div>       
                    </div>
                </div>       
                <div className="btn_section">
                    <div id="break-container" className="small_container">
                        <p id="break-label" className="text">break length</p>
                        <div className="btn_section">
                            {Button(<FontAwesomeIcon icon={faPlus} size="lg" />,"break-increment",(()=>this.count("+","break")), "element", (!!this.state.timerId || this.state.break>=60))}
                            <p id="break-length" className="element text">{this.state.break}</p>
                            {Button(<FontAwesomeIcon icon={faMinus} size="lg" />,"break-decrement",(()=>this.count("-","break")), "element", (!!this.state.timerId || this.state.break<=1))}
                        </div>    
                    </div>
                    <div id="session-container" className="small_container">
                        <p id="session-label" className="text">session length</p>
                        <div className="btn_section">
                            {Button(<FontAwesomeIcon icon={faPlus} size="lg" />,"session-increment",(()=>this.count("+","session")), "element", (!!this.state.timerId || this.state.session>=60))}
                            <p id="session-length" className="element text">{this.state.session}</p>
                            {Button(<FontAwesomeIcon icon={faMinus} size="lg" />,"session-decrement",(()=>this.count("-","session")), "element", (!!this.state.timerId || this.state.session<=1))}
                        </div>    
                    </div>
                </div>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Clock />);