import numpy as np



# english and chinese words
data = [
    [
        'word',
        'skill',
        'learn',
        'train',
        'offer',
        'alike',
        'be',
        'can'
    ], [
        'nihao',
        'women',
        'shang',
        'xui',
        'qi',
        'pao',
        'qian',
        'da'
    ]
]



class NeuralNetwork(object):
    def __init__(self, numInputs, numOutputs):
        self.numInputs = numInputs
        self.numOutputs = numOutputs
        self.numHidden = 3
        
        # build the neural network
        # no need for inputs b/c they are always constant
        self.hidden = [Synapse(self.numInputs) for _ in range(self.numHidden)]
        self.output = [Synapse(self.numHidden) for _ in range(self.numOutputs)]
    
    
    def run(self, inputs):
        hiddenOut = []
        
        for syn in self.hidden:
            hiddenOut.append(syn.forward(inputs))
        
        output = []
        for syn in self.output:
            output.append(syn.forward(hiddenOut))
        
        return output
    
    
    def blah(self):
        pass




class Synapse(object):
    def __init__(self, numAxons):
        self.weight = np.random.rand(numAxons)
        self.numAxons = numAxons
    
    
    def forward(self, axons):
        total = 0
        
        for i in range(len(axons)):
            total = total + self.weight[i] * axons[i]
        
        return sigmoid(total)
    
    
    def backpropogate(self):
        pass
    
    
    def changeWeight(self, weight):
        self.weight = weight




def sigmoid(x):
    return 1 / (1 + np.exp(-x))
