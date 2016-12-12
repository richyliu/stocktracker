import numpy as np




class NeuralNetwork(object):
    def __init__(self, numInputs, numOutputs):
        self.numInputs = numInputs
        self.numOutputs = numOutputs
        self.numHidden = 10
        
        # build the neural network
        # no need for inputs b/c they are always constant
        self.hidden = [Synapse(self.numInputs) for _ in range(self.numHidden)]
        self.output = [Synapse(self.numHidden) for _ in range(self.numOutputs)]
    
    
    def run(self, inputs):
        hiddenOut = []
        
        for syn in self.hidden:
            hiddenOut.append(syn.forward(inputs))
        
        for syn in self.output:
            syn.forward(hiddenOut)
    
    
    def blah(self):
        pass




class Synapse(object):
    def __init__(self, numAxons):
        # self.weight = np.random.rand(numAxons)
        self.weight = 1
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




if __name__ == '__main__':
    nn = NeuralNetwork(5, 2)
    print(nn.run([2, 3, 4, 2, 1]))
