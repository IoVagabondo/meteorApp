 var handle = null;

 Template.formStep2.onCreated(() => {
     let template = Template.instance();

     template.searchQuery = new ReactiveVar();
     template.searching = new ReactiveVar(false);

     template.filter1 = new ReactiveVar();
     template.filter2 = new ReactiveVar();


     template.autorun(() => {
         template.subscribe('searchableInitiatives', template.searchQuery.get(), () => {
             setTimeout(() => {
                 template.searching.set(false);
             }, 300);
         });
     });
 });

 Template.formStep2.onRendered(function() {

     // Set search query to value of form-step-1
     var query = Session.get('searchQuery');
     this.find('.searchQuery').value = query;

     // Set filter1 & filter2 to value of form-step-1
     var filter1 = Session.get('filter1');
     var filter2 = Session.get('filter2');
     $('#filter1').val(filter1);
     $('#filter2').val(filter2);


     if (query !== '') {
         Template.instance().searchQuery.set(query);
         Template.instance().searching.set(true);
     }

     Template.instance().filter1.set(filter1);
     Template.instance().filter2.set(filter2);



 });


 Template.formStep2.helpers({

     // Listing posts
     initiativesList: function() {
         return Initiatives.find({}, { sort: { timeCreated: -1 } });
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

     initiatives() {
         if (Template.instance().filter1.get() && Template.instance().filter1.get() !== 'none') {
             let initiatives = Initiatives.find({
                 location: Template.instance().filter1.get()
             });
             if (initiatives) {
                 return initiatives;
             }
         } else {
             let initiatives = Initiatives.find();
             if (initiatives) {
                 return initiatives;
             }
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
     }
 });