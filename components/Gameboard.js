import { useState, useEffect } from "react";
import { Text, View, Pressable, TextInput, Button, ScrollView, Alert } from "react-native";
import styles from '../style/style';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let board = [];
let spotsBoard = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const POINTS_TO_BONUS = 63;
const NBR_OF_SPOTS = 6;

for(let i = 0; i < NBR_OF_SPOTS; i++){
    spotsBoard[i] = "numeric-"+(i+1)+"-circle";
}

export default function Gameboard() {
    
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [statusToDo, setStatusToDo] = useState('');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    
    const [selectedSpots, setSelectedSpots] = useState(new Array(NBR_OF_SPOTS).fill(false));
    const [points, setPoints] = useState(0);
    const [statusBonus, setStatusBonus] = useState('You are '+POINTS_TO_BONUS+' away from bonus');
    const [spotsPoints, setSpotsPoints] = useState(new Array(NBR_OF_SPOTS).fill(0));

    function getDiceColor(i){
        return selectedDices[i] ? "black" : "steelblue";
    }

    function getSpotsColor(i){
        return selectedSpots[i] ? "black" : "steelblue";
    }

    function selectDice(i) {

        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    }

    function selectSpot(i){
        let spots = [...selectedSpots];
        spots[i] = selectedSpots[i] ? false : true;
        setSelectedSpots(spots);
    }
//*******************************************************//
//****Qui devi implementare una funzione che aumenta ****//
//****il numero dei punti in maniera simile alle fun-****//
//****zioni qui sopra (selectDice(i) e selectSpot(i))****//
//*******************************************************//

    function throwDices() {
        for (let i = 0; i < NBR_OF_DICES; i++){
            if(!selectedDices[i]){
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    }

    function checkBonusPoints() {
        // ************    DA DEFINIRE     **************
    }

    useEffect(() => {
        checkBonusPoints();
        if(nbrOfThrowsLeft === NBR_OF_THROWS){
            setStatusToDo('Throw dices.');
        }

        //************ DEVO AGGIUNGERE ANCORA ***********
        //             else{....}

        if(nbrOfThrowsLeft < 0){
            setNbrOfThrowsLeft(NBR_OF_THROWS - 1);
        }
    }, [nbrOfThrowsLeft]);

    const row = [];
    for(let i = 0; i < NBR_OF_DICES; i++){
        row.push(
            <Pressable
                key={"row"+i}
                onPress={() => selectDice(i)}
            >
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row" + i}
                    size={50}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        );
    }
    const spotsRow = [];
    for(let i = 0; i < NBR_OF_SPOTS; i++){
        spotsRow.push(
            <Pressable
                key={"spot"+i}
                onPress={() => selectSpot(i)}
            >
                <MaterialCommunityIcons
                    name={spotsBoard[i]}
                    key={"spot" + i}
                    size={50}
                    color={getSpotsColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        );
    }
    


    return(          //lo stile gameboard l'ho cancellato
        <View style={styles.gameboard}>
            <View style={styles.flex}>{row}</View>
            
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            
            <Text style={styles.gameinfo}>{statusToDo}</Text>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button}
                    onPress={() => throwDices()}>
                        <Text style={styles.buttonText}>
                            Throw dices
                        </Text>
                </Pressable>
            </View>

            

            <Text style={styles.gameinfo}>Total: {points}</Text>
            <Text style={styles.gameinfo}>{statusBonus}</Text>

            {/* metti le palline con in punti */}
            <View style={styles.spots} >
                <Text>{spotsPoints}</Text>
            
                <View style={styles.spots}>{spotsRow}</View>
            </View>

        </View>
    
    );
}