;(function($) {

    /**
     * Projet IA - Jeu Taquin
     *
     * @author Zhao ZHANG
     * @email zo.zhang@gmail.com
     */
    var Taquin = function (settings) {

        if (!settings) {
            console.log('les paramètres sont obligatoires.');
            return;
        }

        this.settings = {
            size : {
                width: 450,
                height: 460
            },
            level : {
                row: 3, 
                col: 3
            },
            titles : {
                'BFS': 'Breadth First Search',
                'DFS': 'Depth First Search'
            }
        };

        for (var attribue in settings) { 
            this.settings[attribue] = settings[attribue]; 
        }

        // initialise les functions
        this.initialise = function() {

            if (typeof this.settings.randomOrder === 'undefined') {
                // initialise des numéros finaux et aléatoires
                this.generateOrder();
            } 

            return this;
        };

        /*
         * This post on stackexchange explained the condition when a puzzle
         * is unsolvable http://math.stackexchange.com/a/838818
         */
        this.checkSolvable = function () {
            var count, _order;
            count = 0;
            _order = this.randomOrder.slice();

            _order.splice(this.EmptyBlockPosition, 1);

            for (var i = 0; i < _order.length; i++) {
                for (var j = i + 1; j < _order.length; j++) {
                    if (_order[i] > _order[j]) {
                        count++;
                    }
                }
            }
            return count % 2 === 0;
        };

        // génére les numeros finuax et aléatoire
        this.generateOrder = function () {

            this.goalOrder = [];
            this.randomOrder = [];

            // génére des numéros finaux par son hiérarchie
            for (var i = 0; i < this.settings.level.row * this.settings.level.col; i++) {
                this.goalOrder.push(i);
            }

            // mette un numero blanc
            this.emptyBlockNumber = this.goalOrder.length - 1;

            // génére des numéros aléatoire par le longeur de numéro finaux
            for (var i = 0, len = this.goalOrder.length; i < len; i++) {
                var order = Math.floor(Math.random() * len);
                if (this.randomOrder.length > 0) {
                    while (jQuery.inArray(order, this.randomOrder) > -1) {
                        order = Math.floor(Math.random() * len)
                    }
                }

                // enregestre la position du numéro blanc
                if (order == this.emptyBlockNumber) {
                    this.emptyBlockPosition = i;
                }

                this.randomOrder.push(order);
            }

            // si le numéro d'ordre n'est pas résoluble
            if (!this.checkSolvable(this.randomOrder)) {
                this.generateOrder();
            }
        };

        // création des blocks
        this.createLayout = function () {

            var index, fragment, $fragment, debrisDiv;

            this.$section = $(document.createElement('section'));

            this.$article = $(document.createElement('article'));

            this.$header  = $(document.createElement('header'));

            this.$footer  = $(document.createElement('footer'));

            this.$header.append('<h3>'+this.settings.titles[this.settings.algorithme]+'</h3>');

            this.$article.append(this.$header, this.$footer);

            fragment = document.createElement('createDocumentFragment');
            $fragment = $(fragment);

            this.$footer.css({
                width: this.settings.size.width,
                height: this.settings.size.height
            });

            this.debrisMap = {};
            this.debrisWidth = this.settings.size.width / this.settings.level.row;
            this.debrisHeight = this.settings.size.height / this.settings.level.col;

            for (var i = 0; i < this.settings.level.row; i++) {
                for (var j = 0; j < this.settings.level.col; j++) {

                    var style = {
                        'width': (this.debrisWidth - 2) + 'px',
                        'height': (this.debrisHeight - 2) + 'px',
                        'left': j * this.debrisWidth + 'px',
                        'top': i * this.debrisHeight + 'px',
                        'line-height': (this.debrisHeight - 2) + 'px',
                        "background": "url('" + this.settings.imageSrc + "')",
                        'backgroundPosition': (-j) * this.debrisWidth + 'px ' + (-i) * this.debrisHeight + 'px'
                    };

                    index = i * this.settings.level.row + j;

                    if (index == this.emptyBlockNumber) {
                        style.background = '#ffffff';
                    }

                    debrisDiv = $(document.createElement('div')).html(index).css(style);
                    $fragment.append(debrisDiv);
                    this.debrisMap[index] = debrisDiv;
                 }
            }

            this.$footer.empty().append(fragment.childNodes);
            this.$section.append(this.$article);

            this.randomLayout();

            return this.$section;
        };

        // aléatoire des blocks
        this.randomLayout = function () {

            for (var index in this.randomOrder) {

                var debrisMaps = this.debrisMap;
                var randomIndex = this.randomOrder[index];

                var top = debrisMaps[index].css('top');
                var left = debrisMaps[index].css('left');

                this.debrisMap[randomIndex].animate({
                    'top': top,
                    'left': left
                }, 350);
            }
        };

        // applique l'agorithme à jouer tout seule
        this.applyAlgorithme = function () {

            switch (this.settings.algorithme) {

                case 'BFS' :

                  this.algoBFS();

                    break;
                case 'DFS':

                    this.algoDFS();

                    break;
            }
        };

        // vérifie le succès
        this.checkSuccess = function (originalOrder, currentOrder) {
            if (!originalOrder || !currentOrder) {
                return false;
            }

            for (var i = 0; i < originalOrder.length; i++) {
                if (originalOrder[i] !== currentOrder[i]) {
                    return false;
                }
            }
            return true;
        };


        // implémente l'algorithme - Breadth First Search
        this.algoBFS = function () {

            console.log(this.settings.algorithme)
            
        };

        // implémente l'algorithme - Depth First Search
        this.algoDFS = function () {
                        console.log(this.settings.algorithme)

        };

        return this.initialise();
    };

    /**
     * Commence à jouer par IA.
     */
    $(document).ready(function(){

       var BFS = new Taquin({
           algorithme: 'BFS',
           imageSrc : '../images/bfs.jpg'
       });

       var actions = $('<section><article><button class="btn btn-success">Comparaison</button></article></section>');

       var DFS = new Taquin({
           algorithme: 'DFS',
           imageSrc : '../images/dfs.jpg',
       });

       $('main').append(BFS.createLayout(), actions, DFS.createLayout());

       $('button', actions).click(function() {

          $(this).css('visibility', 'hidden');

          setTimeout(function(){
              BFS.applyAlgorithme();
              DFS.applyAlgorithme();
          }, 50);

       });

    });

})(jQuery);