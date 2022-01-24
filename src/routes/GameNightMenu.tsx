import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import React from 'react';

interface gameNightProps {
    token: string;
}

interface gameNightObject {
    pk: number;
    rid: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
}


export default function GameNightMenu(props: gameNightProps) {
    const [gameNightList, setGameNightList] = useState<gameNightObject[]>([]);
    useEffect(() => {
        if (props.token !== "") {
        const gameNightUrl = `https://maestrodeljuego.herokuapp.com/gamenight/`;
        axios
            .get(gameNightUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${props.token}`,
                  },
            })
            .then((response) => {
                console.log(response)
                setGameNightList(response.data)
                const gameNightArray: Array<gameNightObject> = []
                response.data.forEach((entry: any) => {
                    const entryObject: gameNightObject =
                    {pk:entry.pk, rid:entry.rid, date:entry.date, start_time:entry.start_time, end_time:entry.end_time, location:entry.location, status: entry.status};
                    gameNightArray.push(entryObject)
                })
                gameNightArray.sort(function(a,b) {
                    return Date.parse(b.date) - Date.parse(a.date); }); //sorts array by date, newest to oldest
                setGameNightList(gameNightArray);
            });
        }}, [props.token]);

    return (
        <>
        {props.token !== "" ? (
        <div className="game-night-menu-container">
            <Link className="new-event-link" to="/createevent/">Create New Event</Link>
            <h4>Upcoming Game Nights</h4>
            {gameNightList.map((event) => (
                <React.Fragment key={`upcoming-${event.pk}`}>
                {(moment(event.date).isBefore(moment()) === false && event.status !== "Cancelled") ? (
                    <div className="game-night-event-container">
                            <p className="event-info-date-loc">{moment(event.date).format('MMM DD, YYYY')} @ {event.location}</p>
                            <p className="event-info-times">{moment(event.start_time, "HH.mm.ss").format("h:mm A")} - {moment(event.end_time, "HH.mm.ss").format("h:mm A")}</p>
                            <Link className="event-voting-link" to={`/game_night/${event.rid}/`}>Share this link with your guests</Link> | 
                            <Link className="event-finalize-link" to={`/game_night/${event.rid}/finalize`}>Finalize event details</Link>
                    </div>) : (<></>)
                }
                </React.Fragment>
            ))}
            <h4>Past Game Nights</h4>
            {gameNightList.map((event) => (
                <React.Fragment key={`past-${event.pk}`}>
                {(moment(event.date).isBefore(moment()) && event.status !== "Cancelled") ? (
                    <div className="game-night-event-container">
                            <div className="event-info-date-loc">{moment(event.date).format('MMM DD, YYYY')} @ {event.location}</div>
                            <div className="event-info-times">{moment(event.start_time, "HH.mm.ss").format("h:mm A")} - {moment(event.end_time, "HH.mm.ss").format("h:mm A")}</div>
                            <Link className="event-link" to={`/game_night/${event.rid}/finalize`}>View Event</Link>
                    </div>) : (<></>)
                }
                </React.Fragment>
            ))}
            <h4>Cancelled Game Nights</h4>
            {gameNightList.map((event) => (
                <React.Fragment key={`cancelled-${event.pk}`}>
                {event.status === "Cancelled" ? (
                <div className="game-night-event-container">
                    <div className="event-info-date-loc">{moment(event.date).format('MMM DD, YYYY')} @ {event.location}</div>
                    <div className="event-info-times">{moment(event.start_time, "HH.mm.ss").format("h:mm A")} - {moment(event.end_time, "HH.mm.ss").format("h:mm A")}</div>
                    <Link className="event-link" to={`/game_night/${event.rid}/finalize`}>View Event</Link>
                </div>
                ) : (<></>)
                }
                </React.Fragment>
            ))}
        </div>
        ) : (<><h4>Please log in to see your game night events.</h4></>)
        }</>
    )
}