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
    $('#bench').on('click', 'img.cooked', itemClick);
    $('#hideme').on('click', function (e) {
      $('#items-container')
        .show();
      $('.content')
        .hide();
        
      return false;
    });
    $('#close').on('click', function (e) {
      $('#info').hide();
      if (small) {
        $('.content').hide();
      }
      $('#items-container').show();
      
      return false;
    });

    // Responsible design (css?)
    if ($('body').width() < 768) {
      small = true;
      $('#items-container\t').hide();
      $('#hideme').hide();
    }

    $(window)
      .on('resize', resizeWindow)
      .on('hashchange', onHashChange);
    resizeWindow();
  });
  
  function onHashChange () {
    var hash = window.location.hash.substring(1);
    if (hash) {
      craft(hash);
    } else {
      $('#info').show();
      $('#no-recipe, #bench, #furnace, #hideme').hide();
    }
  }

  function drawItemList() {
    for (var i in currentItems) {
      if (regular.test(currentItems[i][1])) {
        var type = null;
        if (currentItems[i][2] == '1') {
          type = 'crafted';
        } else if (currentItems[i][2] == '2') {
          type = 'cooked';
        } else {
          type = 'na';
        }

        // WARNING: this is slow
        if (itemtype == currentItems[i][2]) {
          $('#itemlist ul')
            .append('<li class="' + type + '" class="crafted" id="' + currentItems[i][0] + '"><img src="images_minecraft/' + currentItems[i][0] + '.png" alt="' + currentItems[i][1] + '" />' + currentItems[i][1] + ' <span>(id: ' + currentItems[i][0] + ')</span></li>');
        } else if (itemtype == '0') {
          $('#itemlist ul')
            .append('<li class="' + type + '" id="' + currentItems[i][0] + '"><img src="images_minecraft/' + currentItems[i][0] + '.png" alt="' + currentItems[i][1] + '" />' + currentItems[i][1] + ' <span>(id: ' + currentItems[i][0] + ')</span></li>');
        }
      }
    }
  }

  function findItem(id) {
    for (var i in currentItems) {
      if (currentItems[i][0] == id) {
        return currentItems[i];
      }
    }
  }

  function switchRecipes() {
    if (!currentRecipe) return;
    
    for (var i = 0; i <= 8; i++) {
      if (currentRecipe[rotation][i] !== 0) {
        var item = findItem(currentRecipe[rotation][i]);
        var theClass = '';
        if (!item) return;
        
        if (item[2] == '1') {
          theClass = 'crafted';
        } else if (item[2] == '2') {
          theClass = 'cooked';
        }
        
        $('#bench img.b' + i)
          .attr({
            'src': 'images_minecraft/' + currentRecipe[rotation][i] + '.png',
            'id': currentRecipe[rotation][i],
            'alt': item[1],
            'title': item[1]
          }).removeClass('crafted cooked')
          .addClass(theClass);
      } else {
        $('#bench img.b' + i)
          .attr({
            'src': 'images_minecraft/0.png',
            'id': '0',
            'alt': 'air'
          }).removeClass('crafted cooked')
      }
    }
    
    if (currentRecipe.length - 1 <= rotation) {
      rotation = 0;
    } else {
      rotation = rotation + 1;
    }
  }

  function switchFurnace() {
    $('#furnace img.uncooked')
      .attr('src', 'images_minecraft/' + currentRecipe[0][rotation] + '.png')
      .attr('alt', findItem(currentRecipe[0][rotation])[1]);
      
    if (currentRecipe[0].length - 1 <= rotation) {
      rotation = 0;
    } else {
      rotation = rotation + 1;
    }
  }

  $('#search input').on('keyup', function (e) {
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

  $('#itemtype a').on('click', function (e) {    
    itemtype = $(this).attr('id');
      
    $('#itemtype a').css('font-weight', 'normal');
    $(this).css('font-weight', 'bold');
    $('#itemlist ul').empty();
    
    drawItemList();
    
    return false;
  });

  $('#sortby a').on('click', function (e) {      
      $('#sortby a').css('font-weight', 'normal');
      $(this).css('font-weight', 'bold');
      $('#itemlist ul').empty();
      currentItems = null;
      
      if ($(this).attr('id') == '0') {
        currentItems = idItems;
      } else if ($(this).attr('id') == '1') {
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

  function itemClick (e) {
    e.preventDefault();
    craft($(this).attr('id'));
  }

  function craft (id) {
    var item = findItem(id);
    
    window.location.hash = id;
    currentRecipe = allRecipes[id];
    
    if (small) { isSmall();}
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
        
      if (item[3] != '1') {
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

  function resizeWindow() {
    if ($('body').width() >= 768) {
      small = false;
      $('#items-container').show();
      $('.content').show();
    } else {
      small = true;
      if ($('#furnace .cooked').attr('id') != '0' || $('#bench #crafted img').attr('id') != '0') {
        $('#items-container').hide();
      } else {
        $('#items-container').show();
      }
    }
    $('#content').css('height', '0px');
    var listheight = $(window).height() - offset;
    $('#content').css('height', listheight + 'px');
  }
}());