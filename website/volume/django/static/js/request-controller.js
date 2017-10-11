function requestController() {
	var ctrl = this;
	var params = new Object({
		offset: -1,
		labels: new Array(),
		keywords: new Array()
	});

	this.setOffset = function(offset) {
		params.offset = offset;
	}

	this.setLabels = function(labels) {
		params.labels = labels;
	}

	this.setKeywords = function(keywords) {
		params.keywords = keywords;
	}

	this.getData = function() {
		return params;
	}
}