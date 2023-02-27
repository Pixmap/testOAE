
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import drawGraph from '@/drawer/drawer';

export default function Home() {
    const canvasRef = useRef();
    const [gameIsOver, setGameOver] = useState(true);
    const [wsConnection, setWsConnection] = useState();
    const [players, setPlayers] = useState();
    const [roundSecret, setRoundSecret] = useState();
    const [roundNumber, setRoundNumber] = useState();
    const [guessedNumber, setGuessedNumber] = useState(5);
    const [readyToPlay, setReadyToPlay] = useState(true);
    const canvasWidth = 320;
    const canvasHeight = 320;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!wsConnection) {
            const ws = new WebSocket('ws://localhost:7071');
            setWsConnection(ws);

            ws.onopen = () => {
                console.info('ws connection opened');
            };

            ws.onerror = (error) => {
                console.error(`ws connection error: ${error}`);
            }

            ws.onclose = (event) => {
                console.info('ws connection closed');
            }

            ws.onmessage = (msg) => {
                const obj = JSON.parse(msg.data);
                if (obj.cmd === 'started') {
                    setGameOver(false);
                    setPlayers(obj.payload.players);
                }

                if (obj.cmd === 'roundresults' && obj.payload.roundResults) {
                    console.log(JSON.stringify(obj.payload.roundResults));
                    setPlayers(obj.payload.roundResults);
                    setRoundSecret(obj.payload.secretNumber);
                    setRoundNumber(obj.payload.roundNumber);
                }

                if (obj.cmd === 'cleargraph') {
                    const ctx = canvasRef.current?.getContext("2d");
                    if (ctx) {
                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    }
                }

                if (obj.cmd === 'readytoplay') {
                    setReadyToPlay(true);
                }

                if (obj.cmd === 'gameover') {
                    alert('Game over');
                    setGameOver(true);
                    setRoundNumber(undefined);
                }
            }
        }

        drawGraph(roundSecret, canvas, canvasWidth, canvasHeight);
    }, [players, roundSecret]);

    const changeGuessedValue = event => {
        setGuessedNumber(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setReadyToPlay(false);
        wsConnection.send(JSON.stringify({ cmd: 'playround', payload: { guessedNumber } }));
    }

    return (
        <>
            {
                gameIsOver ?
                    <>
                        <button onClick={() => { wsConnection.send(JSON.stringify({ cmd: 'start' })) }}>Start game</button>
                    </> :
                    <>
                        <div className='results'>
                            <p><b>Game summary:</b></p>
                            {
                                players?.map((player, index) => (
                                    player.win === undefined ?
                                        <p key={index} > {index === 0 ? 'Your' : 'Player'}
                                            {index ? index : ''} Balance: {player.balance}
                                        </p> :
                                        <p style={{ color: player.win ? 'green' : 'red' }}
                                            key={index}> {index === 0 ? 'Your' : 'Player'}  {index ? index : ''}
                                            {player.win ? ' Won' : ' Lost'} Guessed number: {player.guessedNumber} Balance: {player.balance}
                                        </p>
                                ))
                            }

                        </div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label className={styles.playroundLabel}>Try to guess secret number:</label>
                                <input type="number" min={0} max={10} maxLength={4} val={guessedNumber} onChange={changeGuessedValue}></input>
                                <button disabled={!readyToPlay} className={styles.playround} type='submit'>Play round</button>
                            </form>
                        </div>
                        {roundNumber &&
                            <>
                                <div>
                                    <p>Round <b>#{roundNumber - 1}</b> Secret number: <b>{roundSecret}</b></p>
                                </div>

                                <div className={styles.graph}>
                                    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} ></canvas>
                                </div>
                            </>
                        }
                    </>
            }
        </>
    )
}
