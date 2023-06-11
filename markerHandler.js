var modelList = [];
AFRAME.registerComponent('markerHandler',{
    init: async function() {
        this.el.addEventListener('markerFound',()=>{
            var model_name = this.el.getAttribute('model_name');
            var barcode_value  = this.el.getAttribute('barcode_value');
            modelList.push({
                model_name: model_name,
                barcode_value: barcode_value
            });
            this.el.setAttribute('visible',true);
        });
        this.el.addEventListener('markerLost',()=>{
            var model_name = this.el.getAttribute('model_name');
            var i = modelList.findIndex(model_name);
            if(i>-1) {
                modelList.splice(i,1);
            }
        });
    },
    getDistance: function(elA, elB) {
        return elA.object3D.position.distanceTo(elB.object3D.position);
    },
    getModelGeometry: function(models, model_name) {
        var barcodes = Object.keys(models);
        for(var barcode of barcodes) {
            if(models[barcode].model_name === model_name) {
                return {
                    position: models[barcode]["placement_position"],
                    rotation: models[barcode]["placement_rotation"],
                    scale: models[barcode]["placement_scale"],
                    model_url: models[barcode]["model_url"]
                };
            };
        };
    },
    placeModel: function(model_name, model) {
        var listContainsModel = this.isModelPresentInArray(modelList,model_name);
        if(listContainsModel) {
            var distance = null;
            var marker1 = document.querySelector(`#marker-base`);
            var marker2 = document.querySelector(`marker-${model_name}`);
            distance = this.getDistance(marker1,marker2);
            if(distance<1.25) {
                var modelEl = document.querySelector(`#${model_name}`);
                modelEl.setAttribute('visible',false);
            };
            var isModelPlaced = document.querySelector(`model-${model_name}`);
            if(isModelPlaced === null) {
                var el = document.createElement('a-entity');
                var modelGeometry = this.getModelGeometry(models,model_name);
                el.setAttribute('id',`model-${model_name}`);
                el.setAttribute('gltf-model',`url(${modelGeometry.model_url})`);
                el.setAttribute('position',modelGeometry.position);
                el.setAttribute('rotation',modelGeometry.rotation);
                el.setAttribute('scale',modelGeometry.scale);
                marker1.appendChild(el);
            }
        };
    },
    isModelPresentInArray: function(arr, val) {
        for(var i of arr) {
            if(i.model_name === val) {
                return true;
            };
        };
        return false;
    },
    tick: async function() {
        if(modelList.length > 1) {
            var isBaseModelPresent = this.isModelPresentInArray(modelList, "base");
            var messageText = document.querySelector('#message-text');
            if(!isBaseModelPresent) {
                messageText.setAttribute('visible',true);
            } else {
                if(models === null) {
                    models = await this.getModels();
                };
                messageText.setAttribute('visible',false);
                this.placeModel('road',models);
                this.placeModel('car',models);
                this.placeModel('building1',models);
                this.placeModel('building2',models);
                this.placeModel('building3',models);
                this.placeModel('tree',models);
                this.placeModel('sun',models);
            };
        };
    },
    getModels: function() {
        return fetch('./models.json')
        .then(res => res.json())
        .then(data => data);
    }
});