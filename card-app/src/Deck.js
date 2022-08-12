import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Deck.css';


const BASE_URL = "http://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timeRef = useRef(null);

    const handleClick = () => {
        setAutoDraw(autoDraw => !autoDraw)
    }

    useEffect(()=> {
        async function getDeck(){
            const newDeck = await axios.get(`${BASE_URL}/new/shuffle/`);
            setDeck(newDeck.data);
        }
        getDeck();
    }, [setDeck]);


    useEffect(()=> {
        async function getCard(){
            let { deck_id } = deck;
            try {

                let draw = await axios.get(`${BASE_URL}/${deck_id}/draw/`);
    
                if(draw.data.remaining === 0){
                    throw new Error('No cards left');
                }
    
                const card = draw.data.cards[0];
                setCards(cards => card);
    
            } catch (error) {
                alert(error);
            }
        }

        if(autoDraw && !timeRef.current)
            timeRef.current = setInterval(async ()=> {
            await getCard();
        }, 1000);

        return ()=> {
            clearInterval(timeRef.current);
            timeRef.current = null;
        }

    }, [autoDraw, deck]);

   
  return (
    <div className="deck">
        <button className="button" onClick={handleClick}>Start drawing cards</button>
        {autoDraw ? <img className="cardArea" src={cards.image} /> : <h1> loading..</h1>}
    </div>
  );
}

export default Deck;