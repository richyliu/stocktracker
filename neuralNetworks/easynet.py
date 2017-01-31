import numpy
import scipy.special



class NeuralNetwork:
    def __init__(self, inputnodes, hiddennodes, outputnodes, learningRate):
        # set number of nodes in input, hidden, and output layer
        self.inodes = inputnodes
        self.hnodes = hiddennodes
        self.onodes = outputnodes
        
        # learning rate
        self.lr = learningRate
        
        # activiation function (sigmoid)
        self.activationFunction = lambda x: scipy.special.expit(x)
        
        # init weights
        self.wih = numpy.random.normal(0.0, pow(self.hnodes, -0.5), (self.hnodes, self.inodes))
        self.who = numpy.random.normal(0.0, pow(self.onodes, -0.5), (self.onodes, self.hnodes))
    
    
    
    def train(self, inputsList, targetsList):
        # convert inputs and targets list into 2d array
        inputs = numpy.array(inputsList, ndmin=2).T
        targets = numpy.array(targetsList, ndmin=2).T
        
        # multiply weights with inputs
        hiddenInputs = numpy.dot(self.wih, inputs)
        # apply activation function
        hiddenOutputs = self.activationFunction(hiddenInputs)
        
        # multiply weights with hidden outputs
        finalInputs = numpy.dot(self.who, hiddenOutputs)
        # apply activation function
        finalOutputs = self.activationFunction(finalInputs)
        
        
        # error is target - expected
        outputErrors = targets - finalOutputs
        
        # hidden layer error is the output errors, split by weights, recombined at hidden nodes
        hiddenErrors = numpy.dot(self.who.T, outputErrors)
        
        
        # update weights between hidden and output nodes
        self.who += self.lr * numpy.dot((outputErrors * finalOutputs * (1.0 - finalOutputs)), numpy.transpose(hiddenOutputs))
        
        # update weights between input and hidden nodes
        self.wih += self.lr * numpy.dot((hiddenErrors * hiddenOutputs * (1.0 - hiddenOutputs)), numpy.transpose(inputs))
    
    
    
    def query(self, inputsList):
        # convert inputs list into 2d array
        inputs = numpy.array(inputsList, ndmin=2).T
        
        # multiply weights with inputs
        hiddenInputs = numpy.dot(self.wih, inputs)
        # apply activation function
        hiddenOutputs = self.activationFunction(hiddenInputs)
        
        # multiply weights with hidden outputs
        finalInputs = numpy.dot(self.who, hiddenOutputs)
        # apply activation function
        finalOutputs = self.activationFunction(finalInputs)
        
        return finalOutputs
