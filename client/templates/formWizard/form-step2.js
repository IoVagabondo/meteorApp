 var handle = null;

 Template.formStep2.onCreated(() => {
     let template = Template.instance();

     template.searchQuery = new ReactiveVar();
     template.searching = new ReactiveVar(false);

     template.filter1 = new ReactiveVar();
     template.filter2 = new ReactiveVar();
     template.filter3 = new ReactiveVar();


     template.autorun(() => {
         template.subscribe('searchableInitiatives', template.searchQuery.get(), () => {
             setTimeout(() => {
                 template.searching.set(false);
             }, 300);
         });
         template.subscribe('categories');
         template.subscribe('sections');
         template.subscribe('cities');
     });
 });

 Template.formStep2.onRendered(function() {

     // Set search query to value of form-step-1
     var query = Session.get('searchQuery');
     this.find('.searchQuery').value = query;

     // Set filter1 & filter2 to value of form-step-1
     var filter1 = Session.get('cityId');
     var filter2 = Session.get('categoryId');
     var filter3 = Session.get('sectionId');

     if (!filter1) {
         filter1 = 'none';
     }

     if (!filter2) {
         filter2 = 'none';
     }

     if (!filter3) {
         filter3 = 'none';
     }


     // console.log(filter1);
     $('#filter1').val(filter1);
     $('#filter2').val(filter2);
     $('#filter3').val(filter3);


     if (query !== '') {
         Template.instance().searchQuery.set(query);
         Template.instance().searching.set(true);
     }

     Template.instance().filter1.set(filter1);
     Template.instance().filter2.set(filter2);
     Template.instance().filter3.set(filter3);



 });


 Template.formStep2.helpers({

     // Listing posts
     initiativesList: function() {
         return Initiatives.find({}, { sort: { timeCreated: -1 } });
     },

     categoriesList: function() {
         return Categories.find();
     },

     sectionsList: function() {
         return Sections.find();
     },

     citiesList: function() {
         return Cities.find();
     },

     //select category dynamic in html select dropdown by comparison of option id & stored category id
     selectedCategory: function() {
         return this._id == Session.get('categoryId') ? 'selected' : '';
     },

     selectedSection: function() {
         return this._id == Session.get('sectionId') ? 'selected' : '';
     },

     selectedCity: function() {
         return this._id == Session.get('cityId') ? 'selected' : '';
     },

     searching() {
         return Template.instance().searching.get();
     },

     query() {
         return Template.instance().searchQuery.get();
     },
     // value of the filter to initialize the HTML input
     filter1: function() {
         return Template.instance().filter1.get();
     },
     filter2: function() {
         return Template.instance().filter2.get();
     },
     filter3: function() {
         return Template.instance().filter3.get();
     },

     initiatives() {

         let query = {};

         if (Template.instance().filter1.get() && Template.instance().filter1.get() !== 'none') {
             query.cityId = Template.instance().filter1.get();
         }
         if (Template.instance().filter2.get() && Template.instance().filter2.get() !== 'none') {
             query.categoryId = Template.instance().filter2.get();
         }

         if (Template.instance().filter3.get() && Template.instance().filter3.get() !== 'none') {
             query.sectionId = Template.instance().filter3.get();
         }

         let initiatives = Initiatives.find(query);
         if (initiatives) {
             return initiatives;
         }

     }

 });

 Template.formStep2.events({
     'click button.lazyload': function(e, template) {
         var currentLimit = Session.get('lazyloadLimit_initiatives');
         Session.set('lazyloadLimit_initiatives', currentLimit + 2);
     },

     'input input.searchQuery': function(event, template) {

         let value = event.target.value.trim();
         var self = this;


         if (handle)
             clearTimeout(handle);
         handle = setTimeout(function() {
             var query = $(event.target).val();
             Session.set('searchQuery', query);
             template.searchQuery.set(value);
             template.searching.set(true);
         }, 700);

     },

     'keyup [name="search"]' (event, template) {
         let value = event.target.value.trim();

         if (value !== '' && event.keyCode === 13) {
             template.searchQuery.set(value);
             template.searching.set(true);
         }

         if (value === '') {
             template.searchQuery.set(value);
         }
     },



     'change #filter1': function(event, template) {
         var currentValue = $(event.target).val();
         template.filter1.set(currentValue);
         Session.set('cityId', currentValue);
     },

     'change #filter2': function(event, template) {
         var currentValue = $(event.target).val();
         template.filter2.set(currentValue);
         Session.set('categoryId', currentValue);
     },

     'change #filter3': function(event, template) {
         var currentValue = $(event.target).val();
         template.filter3.set(currentValue);
         Session.set('sectionId', currentValue);
     }
 });
