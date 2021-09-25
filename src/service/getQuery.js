import { fullDataset } from '..';
import { hashingOperations, decodeMatrix, decodeOperations } from '../data/dataProcessing';




export default function getQuery(nodeData, edgeData){
    const opsType = nodeData.map(node => node.type);
    const opsIndex = nodeData.map(node => node.index);
    const encodedOperations = hashingOperations(opsType);
    const result = {query : null, recommend : null};
    const recommend = [];

    const dataset = fullDataset[encodedOperations];
    for (let data of dataset){
        
        let cnt = 0;
        let skip = false;

        const moduleOperations = decodeOperations(data[1]);
        const moduleAdjacency = decodeMatrix(data[0]);
        const moduleAdjacencyOrg = JSON.parse(JSON.stringify(moduleAdjacency));
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
            else{
                moduleAdjacency[mappedSourceIndex][mappedTargetIndex] = 0;
            }
        }
        
        let check = 1;
        for (let row of moduleAdjacency){
            for (let col of row){
                if (col == 1){
                    check = 0;
                }
            }
        }
        
        if (check){
            result.query = {
                trainable_parameters : data[3],
                training_time : data[2],
                train_accuracy : data[4],
                validation_accuracy : data[5],
                test_accuracy : data[6]
            }
        }
        
        if(skip == false){
            recommend.push(
                [
                    data[6], //final_test_accuracy
                    moduleOperations,
                    moduleAdjacencyOrg,
                ]
            )
        }


    }
    recommend.sort((a, b) => b[0] - a[0]);
    result.recommend = recommend.slice(0,5);
    return result;
}
    