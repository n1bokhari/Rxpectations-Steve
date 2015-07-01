'use strict';
//Node Packages
var path = require('path');
//App Packages
var getData = require('../lib/getData');
var getDataHTTPS = require('../lib/getDataHTTPS');

//Models
var IndexModel = require('../models/index');
var drugEventResponse = require('../models/static/drugEventResponse');


module.exports = function (router) {

    var model = new IndexModel();

    router.get('/styleguide', function (req, res) {

        // Use path.normalize for consistent paths
        // across Windows and OS
        res.render(path.normalize('styleguide'), model.Styleguide());

    });

    router.get('/disclaimer', function (req, res) {

        // Use path.normalize for consistent paths
        // across Windows and OS
        res.render(path.normalize('disclaimer'), model.Styleguide());

    });

    router.get('/static/events', function(req, res) {
        res.json(drugEventResponse());

    });

    router.get('/events/:drugname', function (req, res) {
        var drugname = req.params.drugname;
        var model = {
            drugname: drugname.replace(/-/g, ' '),
            hashtag: drugname.replace(/\s/g, ''),
            script: 'events'
        };

        var handleRecalls = function(err, data) {
            var info = JSON.parse(data);
            model.recalls = info.recalls;
            model.recallsTotal = info.recalls.length;
            model.drugInfo = info.drugInfo.drugInfo;
            // Use path.normalize for consistent paths
            // across Windows and OS
            console.log(model);
            res.render(path.normalize('drug-detail'), model);
        };

        var getRecalls = new getData(
            'http://localhost:' + (process.env.PORT || 8000)+'/integrations/openFDA/info?drug='+model.drugname+'&mode=name',
            { timer: false },
            handleRecalls);

    });

    router.get('/search', function (req, res){

        var handleSearchResults = function(err, data) {
            var model = JSON.parse(data);
            model.term = req.query.term;
            model.totalResults = model.results.brandNames.length + model.results.genericNames.length;
            console.log(model);
            res.render('search', model);
        };

        var getSearchResults = new getData(
            'http://localhost:' + (process.env.PORT || 8000)+ '/integrations/openFDA/?drug='+req.query.term+'&mode=all',
            {timer: false},
            handleSearchResults);
    });
    router.get('/', function (req, res) {
        // Use path.normalize for consistent paths
        // across Windows and OS
        res.render(path.normalize('index'), model.Index());

    });

    router.get('/testingAPI', function(req, res) {
        var handleAPI = function(err, data) {
            var api = JSON.parse(data);
            api.total = 0;
            for (var effect in api.results)  {
                api.total += api.results[effect].count;
            }
            res.json(api);
        };
        var getAPI = new getDataHTTPS(
            'https://api.fda.gov/drug/event.json?search=%28product_description:'+req.query.term+'+patient.drug.openfda.brand_name:'+req.query.term+'+patient.drug.openfda.generic_name:'+req.query.term+'%29&count=patient.reaction.reactionmeddrapt.exact&limit=10',
            {timer : false},
            handleAPI
        );
    });

    // Dyanmic routing example
    router.get('/error/:error', function (req, res) {
        // Use path.normalize for consistent paths
        // across Windows and OS
        res.render(path.normalize('errors/'+req.params.error), {});

    });

    // Dyanmic routing example
    router.get('/:templatename', function (req, res) {
        // Use path.normalize for consistent paths
        // across Windows and OS
        res.render(path.normalize(req.params.templatename), model.Styleguide());

    });

};
