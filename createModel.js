AFRAME.registerComponent('city', {
    init: async function() {
        var models = await this.getModels();
        var barcodes = Object.keys(models);
        
        barcodes.map(barcode => {
            var model = models[barcode];
            this.createModels(model);
        });
    },
    getModels: function() {
        return fetch('./models.json')
        .then(res => res.json())
        .then(data => data);
    },
    createModels: async function(model) {
        var barcodeValue = model.barcode_value;
        var modelUrl = model.model_url;
        var modelName = model.model_name;

        var scene = document.querySelector('a-scene');
        var marker = document.createElement('a-marker');

        marker.setAttribute('id', `marker-${modelName}`);
        marker.setAttribute('type', 'barcode');
        marker.setAttribute('model_name', modelName);
        marker.setAttribute('value', barcodeValue);
        marker.setAttribute('markerhandler', {});

        scene.appendChild(marker);

        if(barcodeValue === 0) {
            var modelElement = document.createElement('a-entity');
            modelElement.setAttribute('id', `${modelName}`);
            modelElement.setAttribute('geometry', {
                primitive: 'box',
                width: model.width,
                height: model.height
            });
            modelElement.setAttribute('position', model.position);
            modelElement.setAttribute('rotation', model.rotation);
            modelElement.setAttribute('material', {
                color: model.color
            });

            marker.appendChild(modelElement);
        } else {
            var modelElement = document.createElement('a-entity');

            modelElement.setAttribute('id', `${modelName}`);
            modelElement.setAttribute('gltf-model', `url(${modelUrl})`);
            modelElement.setAttribute('scale', model.scale);
            modelElement.setAttribute('position', model.position);
            modelElement.setAttribute('rotation', model.rotation);

            marker.appendChild(modelElement);
        }
    }
});