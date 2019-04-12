class JobData {
    static typeTable = { 
        0: "Local", 
        1: "AWS"
    };

    static resolveType(index){
        return this.typeTable[index];
    }

    static getMetricKeys(exp) {
        if(exp.metrics === undefined) {
            return [];
        }
        else {
            return Object.keys(exp.metrics.training);
        }
    }

    static getTrainingMetricValues(exp, metricName) {
        if(exp.metrics !== undefined && exp.metrics.training !== undefined && metricName in exp.metrics.training) {
            return exp.metrics.training[metricName];
        }
        else {
            return [];
        }
    }

    static getValidationMetricValues(exp, metricName) {
        if(exp.metrics !== undefined && exp.metrics.validation !== undefined && metricName in exp.metrics.validation) {
            return exp.metrics.validation[metricName];
        }
        else {
            return [];
        }
    }

    static getExpStatus(exp) {
        // Status -1 => in setup
        // Status 100 => training running
        // Status 1 => training finished
        // Status 200 => test running
        // Status 2 => test finished
        let statusStr = "";
        switch(exp.status) {
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
                statusStr = "unkown status code: " + exp.status;
                break;
        }
        return statusStr;
    }

    static getProgress(exp) {
        const fullSteps = exp.max_epochs * exp.max_batches_per_epoch;
        if(fullSteps === 0)
            return 0;
        const currStep = exp.max_batches_per_epoch * exp.curr_epoch + (exp.curr_batch + 1);
        const progress = currStep / fullSteps;
        return progress;
    }
}

export default JobData;