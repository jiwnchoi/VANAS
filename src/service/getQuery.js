import { fullDataset, unstructuredDataset } from '..';
import { decodeOperations } from '../data/dataProcessing';

const codedOperation = {
    'input': 0,
    'output': 1,
    'conv1x1-bn-relu': 2,
    'conv3x3-bn-relu': 3,
    'maxpool3x3': 4
}



export function matchGraph(nodeData, edgeData, dataEdges, dataOps){

    const dataMapper = {
        2 : [],
        3 : [],
        4 : [],
    }
    const userMapper = {
        2 : [],
        3 : [],
        4 : []
    }

    //dataMapper에 Type 별로 index 분리
    for (let i = 1; i < dataOps.length-1; i++){
        dataMapper[dataOps[i]].push(i);
    }
    //userMapper에 Type 별로 index 분리
    for (const node of nodeData){
        if (node.index == 0 || node.index ==1) continue;
        userMapper[codedOperation[node.type]].push(node.index);
    }



    const dataOpsType = decodeOperations(dataOps);
    const candidateSequence = new Array(nodeData.length);
    candidateSequence[0] = 0;
    candidateSequence[nodeData.length - 1] = 1;
    
    //가능한 모든 Sequence 생성
    
    let beforeQueue = [candidateSequence];
    let afterQueue = [];
    for (let i=1; i<nodeData.length-1; i++){
        while (beforeQueue.length > 0){
            const currentSequence = beforeQueue.shift();
            const currentType = codedOperation[dataOpsType[i]];
            for (const userIndex of userMapper[currentType]) {
                const newSequence = currentSequence.slice();
                if (newSequence.indexOf(userIndex) != -1) continue
                else newSequence[i] = userIndex;
                afterQueue.push(newSequence);
            }
        }
        beforeQueue = afterQueue;
        afterQueue = [];
    }
    const allCandidateSequence = beforeQueue;


    const dataMatrix = [];
    for (const node of nodeData) {
        dataMatrix.push(new Array(nodeData.length).fill(0));
    }
    for (const edge of dataEdges){
        dataMatrix[edge[0]][edge[1]] = 1;
    }
    //복호화 Matrix랑 Sequence로 만든 Matrix랑 대조
    for (const sequence of allCandidateSequence){
        const emptyMatrix = [];
        for (const node of nodeData){
            emptyMatrix.push(new Array(nodeData.length).fill(0));
        }

        let check = true;
        for (const edge of edgeData){
            const source = sequence.indexOf(edge.source.index);
            const target = sequence.indexOf(edge.target.index);
            if(dataMatrix[source][target] == 0){
                check = false;
                break;
            }
        }
        if (check) return sequence;
    }
    return false;

}



export default function getQuery(nodeData, edgeData){

    const tmp = [0,0,0, edgeData.length];
    for (const node of nodeData){
        if (node.type == 'conv1x1-bn-relu') tmp[0] ++;
        if (node.type == 'conv3x3-bn-relu') tmp[1]++;
        if (node.type == 'maxpool3x3') tmp[2]++;
    }

    
    const keyString = tmp.join("");
    let query = [];
    
    const dataset = fullDataset[keyString];

    for (let data of dataset){
        if(nodeData.length != data[1].length+2) continue;
        if(edgeData.length * 2 != data[0].length) continue;
        const dataEdges = [];
        for (let i=0; i<data[0].length; i+=2){
            dataEdges.push([Number(data[0][i]), Number(data[0][i+1])]);
        }
        const dataOps = data[1];
        const graphMatcher = matchGraph(nodeData, edgeData, dataEdges, dataOps);
        if (graphMatcher) {
            query.push({
                dataEdges,
                ops: data[1],
                trainable_parameters : data[3],
                training_time : data[2],
                train_accuracy : data[4],
                validation_accuracy : data[5],
                test_accuracy : data[6],
                sharpley_value : data[7],
                graph_matcher : graphMatcher
            })
        }
    }
    return query[0];
}



