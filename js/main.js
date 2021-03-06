(function () {
  var currentItems = {};
  var idItems = {};
  var alphaItems = {};
  var allRecipes = {};
  var currentRecipe = {};
  var crafting = null;
  var cooking = null;
  var rotation = 0;
  var itemtype = '0';
  var search = '';
  var regular = /(?:)/i;
  var offset = 60;
  var small = false;

  // On page load:
  $(function () {
    // Get data from JSON:
    $.get('data/minecraft_items.json', function (data) {
      currentItems = data;
      alphaItems = data;
      for (var i = 0, len = currentItems.length; i < len; i++) {
        idItems[i] = currentItems[i];
      }
      quick_sort(alphaItems, 1);
      drawItemList();
    }, 'json');

    $.get('data/minecraft_recipes.json', function (data) {
      allRecipes = data;
      onHashChange();
    }, 'json');

    // Attach event handlers
    $('#itemlist ul').on('click', 'li', itemClick);
    $('#furnace').on('click', 'img.uncooked', itemClick);
    $('#bench').on('click', 'img.slot', itemClick);
    $('#hideme a').on('click', function () {
      $('#items-container').show();
      $('.content').hide();
        
      return false;
    });
    $('#close').on('click', function () {
      $('#info').hide();
      if (small) {
        $('.content').hide();
      }
      $('#items-container').show();
      
      return false;
    });

    $(window)
      .on('resize', onWindowResize)
      .on('hashchange', onHashChange)
      .on('keyup', onKeyUp)
      .on('keydown', onKeyDown);
      
    onWindowResize();
  });
  
  function onWindowResize() {
    // Responsible design (css?)
    small = $('body').width() < 768;
    if (small) {
      if ($('#furnace .cooked').attr('id') !== '0' || $('#bench #crafted img').attr('id') !== '0') {
        $('#items-container').hide();
      } else {
        $('#items-container').show();
      }
    } else {
      $('#items-container').show();
      $('.content').show();
    }
    $('#content').css('height', '0px');
    var listheight = $(window).height() - offset;
    $('#content').css('height', listheight + 'px');
  }
  
  function onHashChange () {
    var hash = window.location.hash.substring(1);
    if (hash) {
      craft(hash);
    } else {
      $('#info').show();
      if (small) {isSmall();}
      $('#no-recipe, #bench, #furnace, #hideme').hide();
    }
  }

  function onKeyUp(e)
  {
    var code = e.keyCode || e.which;
    var itemID = 0;
    var id = 0;
    if(code === 38)
    {
      id = $("#itemlist ul").find('li.clicked').index() + 1;
      if(id - 1 > 0)
      {
        $("#itemlist ul li:nth-child("+ id +")").removeClass("clicked");
        id = id - 1;
        $("#itemlist").scrollTop($("#itemlist").scrollTop() - 42);
        $("#itemlist ul li:nth-child("+ id +")").addClass("clicked");
        itemID = $("#itemlist ul li.clicked").attr("id").substring(5);
        craft(itemID);
      }
    }else if(code === 40) {
      id = $("#itemlist ul").find('li.clicked').index() + 1;
      if(id + 1 < currentItems.length) {
        $("#itemlist ul li:nth-child("+ id +")").removeClass("clicked");
        id = id + 1;
        $("#itemlist").scrollTop($("#itemlist").scrollTop() + 42);
        $("#itemlist ul li:nth-child("+ id +")").addClass("clicked");
        itemID = $("#itemlist ul li.clicked").attr("id").substring(5);
        craft(itemID);
      }
    }
  }

  function onKeyDown(e)
  {
    var code = e.keyCode || e.which;
    if(code === 38 || code === 40) { e.preventDefault(); }
  }

  function drawItemList() {
    for (var i in currentItems) {
      if (regular.test(currentItems[i][1])) {
        var type = null;
        if (currentItems[i][2] === '1') {
          type = 'crafted';
        } else if (currentItems[i][2] === '2') {
          type = 'cooked';
        } else {
          type = 'na';
        }

        // WARNING: this is slow
        if (itemtype === currentItems[i][2]) {
          $('#itemlist ul')
            .append('<li class="' + type + '" class="crafted" id="item-' + currentItems[i][0] + '"><img src="images_minecraft/' + currentItems[i][0] + '.png" alt="' + currentItems[i][1] + '" />' + currentItems[i][1] + ' <span>(id: ' + currentItems[i][0] + ')</span></li>');
        } else if (itemtype === '0') {
          $('#itemlist ul')
            .append('<li class="' + type + '" id="item-' + currentItems[i][0] + '"><img src="images_minecraft/' + currentItems[i][0] + '.png" alt="' + currentItems[i][1] + '" />' + currentItems[i][1] + ' <span>(id: ' + currentItems[i][0] + ')</span></li>');
        }
      }
    }
  }

  function findItem(id) {
    for (var i in currentItems) {
      if (currentItems[i][0] === id) {
        return currentItems[i];
      }
    }
  }

  function switchRecipes() {
    if (!currentRecipe) { return; }

    for (var i = 0; i <= 8; i++) {
      if (currentRecipe[rotation][i] !== '0') {
        var item = findItem(currentRecipe[rotation][i]);
        var theClass = '';
        if (!item){ return; }
        
        if (item[2] === '1') {
          theClass = 'crafted';
        } else if (item[2] === '2') {
          theClass = 'cooked';
        }
        
        $('#bench img.b' + i)
          .attr({
            'src': 'images_minecraft/' + item[0] + '.png',
            'id': 'item-' + item[0],
            'alt': item[1],
            'title': item[1]
          }).removeClass('crafted cooked')
          .addClass(theClass);
      } else {
        $('#bench img.b' + i)
          .attr({
            'src': 'images_minecraft/0.png',
            'id': '0',
            'alt': 'air',
            'title': 'air'
          }).removeClass('crafted cooked');
      }
    }
    
    if (currentRecipe.length - 1 <= rotation) {
      rotation = 0;
    } else {
      rotation = rotation + 1;
    }
  }

  function switchFurnace() {
    var item = findItem(currentRecipe[0][rotation]);
    $('#furnace img.uncooked')
      .attr({
        'src': 'images_minecraft/' + item[0] + '.png',
        'alt': item[1],
        'id': 'item-' + item[0],
        'title': item[1]
      });
      
    if (currentRecipe[0].length - 1 <= rotation) {
      rotation = 0;
    } else {
      rotation = rotation + 1;
    }
  }

  $('#search input').on('keyup', function () {
    search = $(this).val();
    regular = new RegExp(search, 'i');
    $('#itemlist ul').empty();
    if (small) {
      clearTable();
      $('.content').hide();
      $('#items-container').show();
    }
    drawItemList();
    
    return false;
  });

  $('#itemtype a').on('click', function () {
    itemtype = $(this).attr('id');
      
    $('#itemtype a').css('font-weight', 'normal');
    $(this).css('font-weight', 'bold');
    $('#itemlist ul').empty();
    
    drawItemList();
    
    return false;
  });

  $('#sortby a').on('click', function () {
      $('#sortby a').css('font-weight', 'normal');
      $(this).css('font-weight', 'bold');
      $('#itemlist ul').empty();
      currentItems = null;
      
      if ($(this).attr('id') === '0') {
        currentItems = idItems;
      } else if ($(this).attr('id') === '1') {
        currentItems = alphaItems;
      }
      drawItemList();
      
      return false;
    });

  function clearTable() {
    rotation = 0;
    $('#bench img.slot, #bench #crafted img, #furnace img.cooked, #furnace img.uncooked')
      .attr('src', 'images_minecraft/0.png')
      .attr('id', '0')
      .attr('alt', 'air');
      
    $('#bench #crafted span').empty();
    clearInterval(crafting);
    clearInterval(cooking);
  }

  function isSmall () {
    $('#items-container').hide();
    $('#hideme, .content').show();
  }

  function itemClick () {
    craft($(this).attr('id').substr(5));
  }

  function craft (id) {
    var item = findItem(id);

    $('#items ul li').removeClass("clicked");
    $('#item-' + id).addClass("clicked");

    window.location.hash = id;
    currentRecipe = allRecipes[id];

    if (small) {isSmall();}
    clearTable();
    
    $('#info').hide();
    $('.content #url').show();
    $('.content input').attr('value', 'http://craft.whg.no/#' + id);
    
    if (item[2] === '2') {
      $('#bench, #no-recipe').hide();
      $('#furnace, #hideme').show();
      
      $('#furnace img.cooked')
        .attr('src', 'images_minecraft/' + id + '.png')
        .attr('alt', item[1])
        .attr('id', item[0]);
        
      switchFurnace();
      
      if (currentRecipe[0].length > 1) {
        cooking = setInterval(switchFurnace, 2000);
      }
    } else if (item[2] === '1') {
      $('#furnace, #no-recipe').hide();
      $('#bench, #hideme').show();
      
      $('#crafted img')
        .attr('src', 'images_minecraft/' + id + '.png')
        .attr('id', id)
        .attr('id', item[0]);
        
      if (item[3] !== '1') {
        $('#crafted span').append(item[3]);
      }
      switchRecipes();
      if (currentRecipe.length > 1) {
        crafting = setInterval(switchRecipes, 2000);
      }
    } else {
      $('#bench, #furnace').hide();
      $('#no-recipe, #hideme').show()
        .find('h2').text(item[1]);
    }
  }
}());