class JobData {
    static typeTable = { 
        0: "Local", 
        1: "Remote"
    };

    static resolveType(index){
        return this.typeTable[index];
    }

    static getMetricKeys(training) {
        if(training.metrics === undefined) {
            return [];
        }
        else {
            return Object.keys(training.metrics.training);
        }
    }

    static getTrainingMetricValues(training, metricName) {
        if(training.metrics !== undefined && training.metrics.training !== undefined && metricName in training.metrics.training) {
            return training.metrics.training[metricName];
        }
        else {
            return [];
        }
    }

    static getValidationMetricValues(training, metricName) {
        metricName = "val_" + metricName;
        if(training.metrics !== undefined && training.metrics.validation !== undefined && metricName in training.metrics.validation) {
            return training.metrics.validation[metricName];
        }
        else {
            return [];
        }
    }

    static getExpStatus(training) {
        // Status -1 => in setup
        // Status 100 => training running
        // Status 1 => training finished
        let statusStr = "";
        switch(training.status) {
            case -1:
                statusStr = "training starting";
                break;
            case 100:
                statusStr = "training running";
                break;
            case 1:
                statusStr = "training finished";
                break;
            case 2:
                statusStr = "test finished";
                break;
            case 200:
                statusStr = "test running";
                break;
            default:
                statusStr = "unkown status code: " + training.status;
                break;
        }
        return statusStr;
    }

    static getJobStatus(isFinished, inError) {
        if(inError) {
            return "In Error";
        }
        else if(isFinished) {
            return "Set up successful";
        }
        else {
            return "Setting up...";
        }
    }

    static getProgress(training) {
        if(training.curr_epoch < 0)
            return 0;
        const fullSteps = training.max_epochs * training.max_batches_per_epoch;
        if(fullSteps === 0)
            return 0;
        const currStep = training.max_batches_per_epoch * training.curr_epoch + (training.curr_batch + 1);
        const progress = currStep / fullSteps;
        return progress;
    }
}

export default JobData;