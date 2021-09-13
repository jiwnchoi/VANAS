import * as d3 from 'd3';
import { fullDataset } from '..';


function getAccuracyLocal(nodeData, edgeData){

}

function extractOperations(opsnum){
    const ops = ['input'];
    const opsarr = String(opsnum).split("");

    for (let op of opsarr){
        if (op == '2'){
            ops.push('conv1x1-bn-relu');
        }
        else if (op == '3'){
            ops.push('conv3x3-bn-relu');
        }
        else if (op == '4'){
            ops.push('maxpool3x3');
        }
    }
    ops.push('output');
    return ops;
}

function extractMatrix(matnum){
    const numberofNode = parseInt(matnum.length / 3);
    const matrix = [];
    for (let i=0; i<numberofNode; i++){
        const row = matnum.slice(i*3, (i+1)*3);
        const rowNum = Number(row).toString(2).padStart(numberofNode, '0');
        matrix.push(rowNum.split(""));
    }
    return matrix;
}


async function getRecommendationLocal(nodeData, edgeData){
    const opsType = nodeData.map(node => node.type);
    const opsIndex = nodeData.map(node => node.index);
    const result = [];
    for (let data of fullDataset){
        
        let cnt = 0;
        let skip = false;

        const moduleOperations = extractOperations(data[0]);
        const moduleAdjacency = extractMatrix(data[1]);
        const sortedOpsType = JSON.stringify(opsType.slice().sort());
        const sortedModuleOperations = JSON.stringify(moduleOperations.slice().sort());
        if(sortedOpsType != sortedModuleOperations) continue;
        
        const nodeMapper = [];
        nodeMapper.length = nodeData.length;

        nodeMapper[0] = 0
        nodeMapper[nodeMapper.length - 1] = 1

        const conv33Index = [];
        const conv11Index = [];
        const pool33Index = [];
        for(let i=0; i<moduleOperations.length; i++){
            if(moduleOperations[i] == 'conv3x3-bn-relu'){
                conv33Index.push(i);
            }
            else if(moduleOperations[i]  == 'conv1x1-bn-relu'){
                conv11Index.push(i);
            }
            else if(moduleOperations[i]  == 'maxpool3x3'){
                pool33Index.push(i);
            }
        }
        
        for (let edge of edgeData){
            const sourceIndex = edge.source.index;
            const targetIndex = edge.target.index;
            const sourceType = opsType[opsIndex.indexOf(sourceIndex)];
            const targetType = opsType[opsIndex.indexOf(targetIndex)];

            if (nodeMapper.indexOf(sourceIndex) == -1){
                if(sourceType == 'conv3x3-bn-relu'){
                    const idx = conv33Index.shift();
                    nodeMapper[idx] = sourceIndex;
                }
                else if (sourceType == 'conv1x1-bn-relu'){
                    const idx = conv11Index.shift();
                    nodeMapper[idx] = sourceIndex;
                }
                else if (sourceType == 'maxpool3x3'){
                    const idx = pool33Index.shift();
                    nodeMapper[idx] = sourceIndex;
                }
                cnt++;
            }
            if (nodeMapper.indexOf(targetIndex) == -1){
                if(targetType == 'conv3x3-bn-relu'){
                    const idx = conv33Index.shift();
                    nodeMapper[idx] = targetIndex;
                }
                else if (targetType == 'conv1x1-bn-relu'){
                    const idx = conv11Index.shift();
                    nodeMapper[idx] = targetIndex;
                }
                else if (targetType == 'maxpool3x3'){
                    const idx = pool33Index.shift();
                    nodeMapper[idx] = targetIndex;
                }
                cnt++;
            }
            const mappedSourceIndex = nodeMapper.indexOf(sourceIndex);
            const mappedTargetIndex = nodeMapper.indexOf(targetIndex);

            if(moduleAdjacency[mappedSourceIndex][mappedTargetIndex] != 1){
                skip = true;
                break;
            }
        }
            
            if(skip == false){
                result.push(
                    [
                        data[6], //final_test_accuracy
                        moduleOperations,
                        moduleAdjacency
                    ]
                )
            }
        }
        result.sort((a, b) => a[0] - b[0]);
        return result.slice(0,5);
    }
    


export { getAccuracyLocal, getRecommendationLocal }