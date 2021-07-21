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

export function printResult(){
    let resultMatrix = "";
    for (let i=0; i<7; i++){
        for(let j=0; j<7; j++){
            resultMatrix += result[i][j] +" ";
        }
        resultMatrix += "\n";
    }
    alert(resultMatrix);
}


function isCell(){

    // 1의 개수가 9개 이하인지 체크
    // 9번  Matrix Multiplication 하면서 Diagonal에 1이 있는지 확인

}
