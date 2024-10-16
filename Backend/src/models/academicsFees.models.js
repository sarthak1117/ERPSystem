const feeGroupSchema = new mongoose.Schema({
    FeesGroupName: {
        type: String,
        required: true
    },
    FeesGroupType: {
        type: String,
        required: true,
        enum: ["Class", "Transport"]
    },
    description: {
        type: String
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: function() {
            return this.FeesGroupType === 'Class';
        }
    }
});
