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
function printMatix(matrix){
    let resultMatrix = "";
    for (let i=0; i<7; i++){
        for(let j=0; j<7; j++){
            resultMatrix += matrix[i][j] +" ";
        }
        resultMatrix += "\n";
    }
    alert(resultMatrix);
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
    alert(cellChecker);


}
[[0, 0, 0, 0, 0, 0, 0], 
[0, 0, 1, 1, 0, 0, 0], 
[0, 0, 0, 1, 0, 0, 0], 
[0, 0, 0, 0, 0, 0, 0],  
[0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, 0, 0]] 

// 1의 개수가 9개 이하인지 체크
// 9번  Matrix Multiplication 하면서 Diagonal에 1이 있는지 확인



function isCell(result){
    
    const cellCheck = [0, 0, 1]; //Edge가 9개 이상, Cycle존재, INPUT OUTPUT미연결
    
    if (countEdge(result) > 9){
        cellCheck[0] = 1;
    }
    let newMatrix = result; //DAG인데 Upper Traingular Matirx로 표현되어서 DFS도, Power도 쓸 수가 없음... 어떡하지?
    for (let i=0; i<9; i++){
        newMatrix = matmul(newMatrix, result);
        for (let j=0; j<7; j++){
            if(newMatrix[j][j]){
                cellCheck[1] = 1;
                continue;
            }
        }
        
    }
    let newMatrix2 = result;
    for (let i=0; i<9; i++){
        newMatrix2 = matmul(newMatrix2, result);
        if(newMatrix2[0][6]){
            cellCheck[2] = 0;
            continue;
        }
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