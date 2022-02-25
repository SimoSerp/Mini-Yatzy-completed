import { useState, useEffect } from "react";
import { Text, View, Pressable, TextInput, Button, ScrollView, Alert } from "react-native";
import styles from '../style/style';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Col, Row, Grid } from "react-native-easy-grid";

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
    const [totalPoints, setTotalPoints] = useState(0);
    const [statusBonus, setStatusBonus] = useState('You are '+POINTS_TO_BONUS+' away from bonus');
    const [spotsPoints, setSpotsPoints] = useState(new Array(NBR_OF_SPOTS).fill(0));
    const [isTurnSelected, setIsTurnSelected] = useState(false);

    function getDiceColor(i){
        return selectedDices[i] ? "black" : "steelblue";
    }

    function getSpotsColor(i){
        return selectedSpots[i] ? "black" : "steelblue";
    }

    function selectDice(i) {
        if(nbrOfThrowsLeft === 3){
            setStatusToDo('You have to throw dices first.');
        }
        else{
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
    }

    function selectSpot(i){
        if(nbrOfThrowsLeft !== 0){
            setStatusToDo("Throw 3 times before setting points");
        }
        else{
            if(selectedSpots[i]){
                setStatusToDo("You already selected points for "+(i+1));
            }
            else{
                let spots = [...selectedSpots];
                spots[i] = selectedSpots[i] ? false : true;
                setSelectedSpots(spots);

                let sum = 0;
                //board sono i dati
                board.map(item => {
                    if(item === 'dice-'+(i+1)){
                        sum += i+1;
                    }
                });
                let pointsArray = [...spotsPoints];
                pointsArray[i] = sum;
                setSpotsPoints(pointsArray);
                let tot = totalPoints + sum;
                setTotalPoints(tot);
                setStatusToDo('Throw dices.');
                setNbrOfThrowsLeft(3);
                setStatusBonus('You are '+(POINTS_TO_BONUS - tot)+' points away from bonus');

                setSelectedDices(new Array(NBR_OF_DICES).fill(false));

                setIsTurnSelected(true);
                //problema del ONE STEP BEHIND
                
            }
        }

    }

    function restartGame() {
        setNbrOfThrowsLeft(3);
        setStatusToDo('Throw dices.');
        board = [];
        setTotalPoints(0);
        setStatusBonus('You are '+POINTS_TO_BONUS+' away from bonus');
        setSelectedSpots(new Array(NBR_OF_SPOTS).fill(false));
        setSpotsPoints(new Array(NBR_OF_SPOTS).fill(0));

    }

    function throwDices() {
        if(selectedSpots.every(x => x) === true){
            restartGame();
        }
        else if(nbrOfThrowsLeft === 0 && !isTurnSelected){
            setStatusToDo("Select your points before next throw");
        }
        else{
            for (let i = 0; i < NBR_OF_DICES; i++){
                if(!selectedDices[i]){
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = 'dice-' + randomNumber;
                }
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        }
    }

    function checkBonusPoints() {
        if(totalPoints >= POINTS_TO_BONUS){
            setStatusBonus("You got the bonus!");
        }
    }

    useEffect(() => {
        checkBonusPoints();
        setIsTurnSelected(false);
        if(nbrOfThrowsLeft === NBR_OF_THROWS){
            setStatusToDo('Throw dices.');
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else if(nbrOfThrowsLeft < 3 && nbrOfThrowsLeft > 0){
            setStatusToDo('Select and throw dices again.');
        }
        if(nbrOfThrowsLeft === 0){
            setStatusToDo('Select your points.');
        }

        //************ DEVO AGGIUNGERE ANCORA ***********
        //             else{....}
        //forse posso cancellare questo if qua sotto
        if(nbrOfThrowsLeft < 0){
            setNbrOfThrowsLeft(NBR_OF_THROWS - 1);
        }
    }, [nbrOfThrowsLeft]);

    useEffect(() => {
        checkBonusPoints();
        if(selectedSpots.every(x => x) === true){
            setStatusToDo('Game over. All points selected.');
        }
    }, [selectedSpots]);

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

    const pointsRow = []; 
    for (let spot = 0; spot < NBR_OF_SPOTS; spot++) {
        pointsRow.push(
        <Col key={"pointsRow" + spot}>
            <Text 
                style={styles.points}>
                {spotsPoints[spot]}
            </Text>
            <View>
                {spotsRow[spot]}
            </View>
        </Col>
        )  
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

            <Text style={styles.gameinfo}>Total: {totalPoints}</Text>
            <Text style={styles.gameinfo}>{statusBonus}</Text>

            <View style={styles.flex}>
                <Grid>{pointsRow}</Grid>
            </View>
        </View>
    
    );
}