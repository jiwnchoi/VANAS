
import * as d3 from "d3";

const result = [[0, 0, 0, 0, 0, 0, 0], //INPUT
                [0, 0, 0, 0, 0, 0, 0], //1X1 CONV
                [0, 0, 0, 0, 0, 0, 0],  //3X3 CONV
                [0, 0, 0, 0, 0, 0, 0],  //5X5 CONV
                [0, 0, 0, 0, 0, 0, 0], //5X5 CONV
                [0, 0, 0, 0, 0, 0, 0],  //3X3 MAXPOOL
                [0, 0, 0, 0, 0, 0, 0]] //OUTPUT

export function setResult(n1, n2){
    n1 > n2 ? result[n2][n1] = 1 : result[n1][n2] = 1;
}

export function unSetResult(n1, n2){
    n1 > n2 ? result[n2][n1] = 0 : result[n1][n2] = 0;
}

export function checkResult(n1, n2){
    if ( n1 == n2 ){
        return 0;
    }
    let bool = 0;
    n1 > n2 ? bool = !result[n2][n1] : bool = !result[n1][n2];
    return bool
}

//http://192.168.0.54:5000/nasbench
//https://8d11125fda1a.ngrok.io/nasbench

export function getAccuracy(){
    let analytics = null;
    d3.json('//https://8d11125fda1a.ngrok.io/nasbench', {
        method : "POST",
        body : JSON.stringify({
            matrix : result,
        }),
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(json => {
        d3.select("#analytics")
            .attr("class", "alert bg-light alert-secondary")
        d3.select("#trainable_parameters")
            .text(json.trainable_parameters)
        d3.select("#training_time")
            .text(json.training_time)
        d3.select("#train_accuracy")
            .text(json.train_accuracy)
        d3.select("#validation_accuracy")
            .text(json.validation_accuracy)
        d3.select("#test_accuracy")
            .text(json.test_accuracy)
    })
}




export function printResult(){
    let resultMatrix = "";
    for (let i=0; i<7; i++){
        for(let j=0; j<7; j++){
            resultMatrix += result[i][j] +" ";
        }
        resultMatrix += "\n";
    }  
    const cellChecker = isCell(result);
    alert(resultMatrix);
    alert(cellChecker);
}


export function isCell(){
    
    const cellCheck = [0, 1]; //Edge가 9개 이상, INPUT OUTPUT미연결 
    //Cell은 Directed Acyclic Graph인데
    //1. Upper Trangluar Matrix로 Direct가 표현이 되는건가?
    //2. Acyclic이 아니어도 NASBench에서 결과를 뱉는데 왜그런거지?
    //3. 유의미한 Graph만 결과를 뱉는 것이 아니네...
    //=> Cycle Checker는 일단 패스..
    
    if (countEdge(result) > 9){
        cellCheck[0] = 1;
    }
    let newMatrix = result;
    for (let i=0; i<9; i++){
        if(newMatrix[0][6]){
            cellCheck[1] = 0;
            continue;
        }
        newMatrix = matmul(newMatrix, result);
    }
    return cellCheck;
}   

function countEdge(result){
    let count = 0;
    for (let i=0; i<7; i++){
        for (let j=0; j<7; j++){
            if (result[i][j]){
                count ++;
            }
        }
    }
    return count;
}

function matmul(A, B){
    const AB = [[0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0],  
                [0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0], 
                [0, 0, 0, 0, 0, 0, 0]] 

    for (let i = 0; i<7; i++){
        for (let j=0; j<7; j++){
            for (let k=0; k<7; k++){
                AB[i][j] += (A[i][k] * B[k][j])
            }
        }
    }

    return AB;
}