/**
 *
 * Created with NetBeans IDE
 *
 * Code     : Icon Select JS
 * Version  : 1.0
 *
 * User     : Bugra OZDEN
 * Site     : http://www.bugraozden.com
 * Mail     : bugra.ozden@gmail.com
 *
 * Date     : 10/30/13
 * Time     : 01:10 PM
 *
 */

IconSelect.DEFAULT = {};
IconSelect.DEFAULT.SELECTED_ICON_WIDTH = 48;
IconSelect.DEFAULT.SELECTED_ICON_HEIGHT = 48;
IconSelect.DEFAULT.SELECTED_BOX_PADDING = 1;
IconSelect.DEFAULT.SELECTED_BOX_PADDING_RIGHT = 12;
IconSelect.DEFAULT.ICONS_WIDTH = 32;
IconSelect.DEFAULT.ICONS_HEIGHT = 32;
IconSelect.DEFAULT.BOX_ICON_SPACE = 1;
IconSelect.DEFAULT.HORIZONTAL_ICON_NUMBER = 3;
IconSelect.DEFAULT.VECTORAL_ICON_NUMBER = 3;

IconSelect.COMPONENT_ICON_FILE_PATH = "images/arrow.png";

function IconSelect($$elementID, $$parameters) {
    
    var _icons = [];
    var _selectedIndex = -1;
    var _boxScroll;
    
    var _default = IconSelect.DEFAULT;

    function _init() {
        
        //parametreler boş gelirse
        if(!$$parameters) $$parameters = {};
        //En üst elementi seç
        if(_View.setIconSelectElement($$elementID)){
            
            //set parameters
            $$parameters = _Model.checkParameters($$parameters);
            //create UI
            var ui = _View.createUI($$parameters, $$elementID);
            //basıldığında göster/gizle
            _View.iconSelectElement.onclick = function(){
                _View.showBox();
            };
            
            //Başlangıçta gizle
            _View.showBox(false);

            //Nesneye basıldığında gizlemeyi iptal et.
            _View.iconSelectElement.addEventListener('click', function($event){
                $event.stopPropagation();             
            });
            
            //dışarı basıldığında gizle.
            window.addEventListener('click', function(){
                _View.showBox(false);
            });
           
        }else{
            alert("Element not found.");
        }
        
    }
    
    //Tüm iconları yeniden yükle.
    this.refresh = function($icons){
        
        _icons = [];
        
		_View.clearIcons();
		
        var setSelectedIndex = this.setSelectedIndex;
        
        for(var i = 0; i < $icons.length; i++){
            $icons[i].element = _View.createIcon($icons[i].iconFilePath, $icons[i].iconValue, i, $$parameters, $icons[i].name);
            $icons[i].element.onclick = function(){setSelectedIndex(this.childNodes[0].getAttribute('icon-index'));};
            _icons.push($icons[i]);
            
        }
        
        var horizontalIconNumber = Math.round(($icons.length) / $$parameters.vectoralIconNumber);
        
        _View.boxElement.style.height = (($$parameters.iconsHeight + 2) * horizontalIconNumber) + ((horizontalIconNumber + 1) * $$parameters.boxIconSpace) + 'px';
        this.setSelectedIndex(0);
        
    };
    
    //icon listesini al.
    this.getIcons = function(){ return _icons; };
    
    //iconu seçili hale gelir.
    this.setSelectedIndex = function($index){
        
        var icon;
        
        if(_icons.length > $index)
            icon = _icons[$index];
        
        if(icon){
            //eski icondan seçilme özelliğini kaldır.
            if(_selectedIndex != -1) _icons[_selectedIndex].element.setAttribute('class','icon');
            _selectedIndex = $index;
            _View.selectedIconImgElement.setAttribute('src', icon.iconFilePath);
            if(_selectedIndex != -1) _icons[_selectedIndex].element.setAttribute('class','icon selected');
        }
        
        _View.iconSelectElement.dispatchEvent(new Event('changed'));
        
        //_View.showBox(false);
        
    };
    
    this.getSelectedIndex = function(){ return _selectedIndex; };
    this.getSelectedValue = function(){ return _icons[_selectedIndex].iconValue };
    this.getSelectedFilePath = function(){ return _icons[_selectedIndex].iconFilePath };
    
    
    
    //### VIEW CLASS ###
        
    function _View(){}
    
    _View.iconSelectElement;
    _View.boxElement;
    _View.boxScrollElement;
    _View.selectedIconImgElement;
    _View.selectedIconElement;
    
    _View.showBox = function($isShown){
                
         if($isShown == null) {
             $isShown = (_View.boxElement.style.display == "none") ? true : false;
         }
                
        if($isShown) {
            _View.boxElement.style.display = "block";
            _View.boxScrollElement.style.display = "block";
           // _boxScroll = (_boxScroll) ? _boxScroll : new iScroll($$elementID + "-box-scroll");
        }else{
            _View.boxElement.style.display = "none";
            _View.boxScrollElement.style.display = "none";
        }
        
        _View.boxElement.style.display = ($isShown) ? "block" : "none";
        
        
            
    };
    
    _View.setIconSelectElement = function($elementID){
        _View.iconSelectElement = document.getElementById($elementID);
        return _View.iconSelectElement;
    };
    
    _View.clearUI = function(){
        _View.iconSelectElement.innerHTML = "";
    };
    
    _View.clearIcons = function(){
        _View.boxElement.innerHTML = "";
    };
    
    _View.createUI = function($parameters){
        
        
        _View.clearUI();
        
        _View.iconSelectElement.setAttribute('class', 'icon-select');
        
        var selectedBoxElement = document.createElement('div');
        selectedBoxElement.setAttribute('class' ,'selected-box');
        
        var selectedIconElement = document.createElement('div');
        selectedIconElement.setAttribute('class' ,'selected-icon');
        
        _View.selectedIconImgElement = document.createElement('img');
        _View.selectedIconImgElement.setAttribute('src', '');
        selectedIconElement.appendChild(_View.selectedIconImgElement);
        
        var componentIconElement = document.createElement('div');
        componentIconElement.setAttribute('class', 'component-icon');
        
        var componentIconImgElement = document.createElement('img');
        componentIconImgElement.setAttribute('src', IconSelect.COMPONENT_ICON_FILE_PATH );
        componentIconElement.appendChild(componentIconImgElement);
        
        _View.boxScrollElement = document.createElement('div');
        _View.boxScrollElement.setAttribute('id',$$elementID + "-box-scroll");
        _View.boxScrollElement.setAttribute('class', 'box');
        
        _View.boxElement = document.createElement('div');
        
        //_View.boxElement.setAttribute('class', 'box');
        _View.boxScrollElement.appendChild(_View.boxElement);
        
        _View.selectedIconImgElement.setAttribute('width', $parameters.selectedIconWidth);
        _View.selectedIconImgElement.setAttribute('height', $parameters.selectedIconHeight);
        selectedIconElement.style.width = $parameters.selectedIconWidth + 'px';
        selectedIconElement.style.height = $parameters.selectedIconHeight + 'px';
        selectedBoxElement.style.width = $parameters.selectedIconWidth + $parameters.selectedBoxPadding + $parameters.selectedBoxPaddingRight + 'px';
        selectedBoxElement.style.height = $parameters.selectedIconHeight + ($parameters.selectedBoxPadding * 2) + 'px';
        //selectedIconElement.style.top = $parameters.selectedBoxPadding + 'px';
        //selectedIconElement.style.left = $parameters.selectedBoxPadding + 'px';
       // componentIconElement.style.bottom = 5 + $parameters.selectedBoxPadding + 'px';
        
        _View.boxScrollElement.style.left = parseInt(selectedBoxElement.style.width)  -149 + 'px';
        _View.boxScrollElement.style.top = 38 + 'px';
		
        _View.boxScrollElement.style.width = (($parameters.iconsWidth + 2) * $parameters.vectoralIconNumber) + (($parameters.vectoralIconNumber + 1) * $parameters.boxIconSpace) + 'px';
        _View.boxScrollElement.style.height = (($parameters.iconsHeight + 2) * $parameters.horizontalIconNumber) + (($parameters.horizontalIconNumber + 1) * $parameters.boxIconSpace) + 'px';
         
        _View.boxElement.style.left = _View.boxScrollElement.style.left + 'px';
        _View.boxElement.style.width = _View.boxScrollElement.style.width + 'px';
        
        _View.iconSelectElement.appendChild(selectedBoxElement);
        selectedBoxElement.appendChild(selectedIconElement);
        selectedBoxElement.appendChild(componentIconElement);
        selectedBoxElement.appendChild(_View.boxScrollElement);
        
        
        var results = {};
        results['iconSelectElement'] = _View.iconSelectElement;
        results['selectedBoxElement'] = selectedBoxElement;
        results['selectedIconElement'] = selectedIconElement;
        results['selectedIconImgElement'] = _View.selectedIconImgElement;
        results['componentIconElement'] = componentIconElement;
        results['componentIconImgElement'] = componentIconImgElement;
        
        return results;
        
        
       //trigger: created ( run setValues )
        
    };
        
    _View.createIcon = function($iconFilePath, $iconValue, $index, $parameters,  $iconName){
        
        /* HTML MODEL 
         
         <div class="icon"><img src="images/icons/i1.png"></div>
         
         */
        
        var iconElement = document.createElement('div');
        iconElement.setAttribute('class', 'icon');
        iconElement.style.width = $parameters.iconsWidth + 'px';
        iconElement.style.height = $parameters.iconsHeight + 'px';
        iconElement.style.marginLeft = $parameters.boxIconSpace + 'px';
        iconElement.style.marginTop = $parameters.boxIconSpace + 'px';
        
        var iconImgElement = document.createElement('img');
        iconImgElement.setAttribute('src', $iconFilePath);
        iconImgElement.setAttribute('icon-value', $iconValue);
		iconImgElement.setAttribute('name', $iconName);
        iconImgElement.setAttribute('icon-index', $index);
        iconImgElement.setAttribute('width', $parameters.iconsWidth);
        iconImgElement.setAttribute('height', $parameters.iconsHeight);
        
        iconElement.appendChild(iconImgElement);
        _View.boxElement.appendChild(iconElement);
        
        return iconElement;
        
    };
    
    //### MODEL CLASS ###
    
    function _Model(){}
    
    //TODO: params değişkenini kaldır yeni oluştursun.
    _Model.checkParameters = function($parameters){
        
        $parameters.selectedIconWidth          = ($parameters.selectedIconWidth)          ? $parameters.selectedIconWidth        : _default.SELECTED_ICON_WIDTH;
        $parameters.selectedIconHeight         = ($parameters.selectedIconHeight)         ? $parameters.selectedIconHeight       : _default.SELECTED_ICON_HEIGHT;
        $parameters.selectedBoxPadding         = ($parameters.selectedBoxPadding)         ? $parameters.selectedBoxPadding       : _default.SELECTED_BOX_PADDING;
        $parameters.selectedBoxPaddingRight    = ($parameters.selectedBoxPaddingRight)    ? $parameters.selectedBoxPaddingRight  : _default.SELECTED_BOX_PADDING_RIGHT;
        $parameters.iconsWidth                 = ($parameters.iconsWidth)                 ? $parameters.iconsWidth               : _default.ICONS_WIDTH;
        $parameters.iconsHeight                = ($parameters.iconsHeight)                ? $parameters.iconsHeight              : _default.ICONS_HEIGHT;
        $parameters.boxIconSpace               = ($parameters.boxIconSpace)               ? $parameters.boxIconSpace             : _default.BOX_ICON_SPACE;
        $parameters.vectoralIconNumber         = ($parameters.vectoralIconNumber)         ? $parameters.vectoralIconNumber       : _default.VECTORAL_ICON_NUMBER;
        $parameters.horizontalIconNumber       = ($parameters.horizontalIconNumber)       ? $parameters.horizontalIconNumber     : _default.HORIZONTAL_ICON_NUMBER;
    
        return $parameters;
    
    };
    
    _init();
    
}


let countrySelect = function(){
	'use strict'
	let iconSelect;
	iconSelect = new IconSelect('selectCountry', 
		{'selectedIconWidth':35,
		'selectedIconHeight':32,
		'selectedBoxPadding':0,
		'iconsWidth':48,
		'iconsHeight':48,
		'boxIconSpace':0,
		'vectoralIconNumber':3,
		'horizontalIconNumber':6});
	var icons = [];
	icons.push({'iconFilePath':'images/flags/br.png', 'name': 'Brasil', 'iconValue':'brazil'});
	icons.push({'iconFilePath':'images/flags/us.png', 'name': 'Estados Unidos', 'iconValue':'united states'});
	icons.push({'iconFilePath':'images/flags/fr.png', 'name': 'França', 'iconValue':'france'});
	icons.push({'iconFilePath':'images/flags/ru.png', 'name': 'Reino Unido', 'iconValue':'united kingdom'});
	icons.push({'iconFilePath':'images/flags/sp.png', 'name': 'Espanha', 'iconValue':'spain'});
	icons.push({'iconFilePath':'images/flags/ho.png', 'name': 'Holanda', 'iconValue':'netherlands'});
	icons.push({'iconFilePath':'images/flags/ch.png', 'name': 'China', 'iconValue':'china'});
	icons.push({'iconFilePath':'images/flags/ja.png', 'name': 'Japão', 'iconValue':'japan'});
	icons.push({'iconFilePath':'images/flags/me.png', 'name': 'México', 'iconValue':'mexico'});
	icons.push({'iconFilePath':'images/flags/rs.png', 'name': 'Rússia', 'iconValue':'russian federation'});
	icons.push({'iconFilePath':'images/flags/pt.png', 'name': 'Portugal', 'iconValue':'portugal'});
	icons.push({'iconFilePath':'images/flags/ca.png', 'name': 'Canadá', 'iconValue':'canada'});
	icons.push({'iconFilePath':'images/flags/al.png', 'name': 'Alemanha', 'iconValue':'germany'});
	icons.push({'iconFilePath':'images/flags/it.png', 'name': 'Itália', 'iconValue':'italy'});
	icons.push({'iconFilePath':'images/flags/au.png', 'name': 'Austrália', 'iconValue':'australia'});
	icons.push({'iconFilePath':'images/flags/be.png', 'name': 'Bélgica', 'iconValue':'belgium'});
	icons.push({'iconFilePath':'images/flags/ro.png', 'name': 'Romênia', 'iconValue':'romania'});
	icons.push({'iconFilePath':'images/flags/di.png', 'name': 'Dinamarca', 'iconValue':'denmark'});
	iconSelect.refresh(icons);
};


//carregando o select
$(countrySelect());

