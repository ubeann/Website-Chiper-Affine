// Navbar
$(function() {
  	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();
});

// Affine Chiper
// -----------------------------------------------------------
const CRYPTABLE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const M = 26;
// -----------------------------------------------------------
// Some math functions:
const gcd = (a, b) => (b == 0) ? a : gcd(b, a % b);
const mmi = (a, m) => {
  for (let n = 0; n < m; n++)
    if (a * n % m == 1)
      return n;
};
/* the remainder is between [0, b)
 *   -5 % 7 === -5
 *   floorMod(-5, 7) === 2
 */
const floorMod = (a, b) => ((a % b) + b) % b;
// -----------------------------------------------------------
const validateMultiplier = function(a) {
	if (gcd(a, M) != 1) {
		alert("Nilai A harus koprima dengan M(26).");
		throw new Error('Nilai A harus koprima dengan M(26).');
	}
};
const encrypt = (phrase, fn) => 
  phrase
    .toLowerCase()
    .split('')
    .map(c => CRYPTABLE_CHARS.indexOf(c))
    .filter(i => i != -1)
    .map(i => i < M ? fn(i) : i)
    .map(j => CRYPTABLE_CHARS[j])
    .join('');
const grouped = (str) => [...str.matchAll(/.{1,5}/g)].join(" ");
// -----------------------------------------------------------
const encode = (phrase, {a, b}) => {
  validateMultiplier(a);
  const coded = encrypt(phrase, (x) => floorMod(a * x + b, M));
  return grouped(coded);
};
const decode = (phrase, {a, b}) => {
  validateMultiplier(a);
  const a_inv = mmi(a, M);
  const coded = encrypt(phrase, (y) => floorMod(a_inv * (y - b), M));
  return coded;
};
// -----------------------------------------------------------

// Encrypt Listener
function checkEncrypt() {	
	if ($('#encryptKeyA').val() != '' && $('#encryptKeyB').val() != '' && $('#encryptText').val() != '') {
		$('#encryptButton').attr('data-toggle', 'modal');
	} else {
		$('#encryptButton').attr('data-toggle', null);
	}	
}

function resultEncrypt() {
	if ($('#encryptKeyA').val() != '' && $('#encryptKeyB').val() != '' && $('#encryptText').val() != '') {
		// Variable
		var a = $('#encryptKeyA').val();
		var b = $('#encryptKeyB').val();
		var text = $('#encryptText').val();
		var encrypt_text = '';
	
		try {
			// Encrypt using Affine Chiper
			encrypt_text = encode(text, {a: parseInt(a), b: parseInt(b)});
	
			// Show result
			$('#encrypt_key').html('f(x) = ' + a + 'x + ' + b);
			$('#encrypt_text').html(encrypt_text.toUpperCase());
		} catch (e) {
			// Show error
			$('#encrypt_key').html(e);
			$('#encrypt_text').html(e);
		}
	} else {
		alert('Lengkapi nilai A, B, dan Teks terlebih dahulu.');
	}
}

// Decrypt Listener
function checkDecrypt() {	
	if ($('#decryptKeyA').val() != '' && $('#decryptKeyB').val() != '' && $('#decryptText').val() != '') {
		$('#decryptButton').attr('data-toggle', 'modal');
	} else {
		$('#decryptButton').attr('data-toggle', null);
	}	
}

function resultDecrypt() {
	if ($('#decryptKeyA').val() != '' && $('#decryptKeyB').val() != '' && $('#decryptText').val() != '') {
		// Variable
		var a = $('#decryptKeyA').val();
		var b = $('#decryptKeyB').val();
		var text = $('#decryptText').val();
		var decrypt_text = '';
	
		try {
			// Decrypt using Affine Chiper
			decrypt_text = decode(text.toLowerCase(), {a: parseInt(a), b: parseInt(b)});
	
			// Show result
			$('#decrypt_key').html('f(x) = ' + a + 'x + ' + b);
			$('#decrypt_text').html(decrypt_text);
		} catch (e) {
			// Show error
			$('#decrypt_key').html(e);
			$('#decrypt_text').html(e);
		}
	} else {
		alert('Lengkapi nilai A, B, dan Teks Enkripsi terlebih dahulu.');
	}
}