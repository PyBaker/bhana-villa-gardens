(function () {
  'use strict';

  // ---- KNOWLEDGE BASE ----
  var KB = [
    {
      keys: ['location', 'locate', 'address', 'where', 'directions', 'find', 'map', 'get here', 'situated', 'place', 'situated', 'ruwa'],
      answer: '📍 We\'re at <strong>Stand 1234 Villa Gardens, Ruwa, Zimbabwe</strong> — just off the Harare–Mutare Highway. <a href="#location">View on map ↓</a>'
    },
    {
      keys: ['phone', 'number', 'call', 'telephone', 'ring', 'contact number', 'cell', 'mobile'],
      answer: '📞 Call us on <a href="tel:+263779222111"><strong>+263 779 222 111</strong></a> — Mon to Sat, 8am–5pm.'
    },
    {
      keys: ['whatsapp', 'whats app', 'wa', 'chat', 'text', 'message', 'ping'],
      answer: '💬 WhatsApp us on <strong>+263 785 333 222</strong>. <a href="https://wa.me/263785333222?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20Villa%20Gardens" target="_blank" rel="noopener">Open WhatsApp →</a>'
    },
    {
      keys: ['email', 'mail', 'inbox', 'email address'],
      answer: '📧 Email us at <a href="mailto:events@villagardens.co.zw"><strong>events@villagardens.co.zw</strong></a>'
    },
    {
      keys: ['venue', 'venues', 'hall', 'garden', 'pavilion', 'lapa', 'boardroom', 'space', 'spaces', 'room'],
      answer: '🏛️ We have four venues:<br>• <strong>The Garden Pavilion</strong> — open-air ceremonies<br>• <strong>The Grand Hall</strong> — up to 300 guests<br>• <strong>The Lapa</strong> — intimate outdoor<br>• <strong>The Boardroom</strong> — corporate meetings<br><a href="#venues">See all →</a>'
    },
    {
      keys: ['rate', 'rates', 'price', 'pricing', 'cost', 'much', 'fee', 'package', 'charge'],
      answer: '💰 Rates are tailored to your event. We offer up to <strong>50% off</strong> in Jan/Feb 2026. <a href="rates.html">View rates →</a>'
    },
    {
      keys: ['discount', 'offer', 'special', 'promo', 'deal', 'saving'],
      answer: '🎉 <strong>Jan &amp; Feb 2026</strong> — 50% off. <strong>Jun, Jul &amp; Nov 2026</strong> — 25% off. <a href="rates.html">Full details →</a>'
    },
    {
      keys: ['book', 'booking', 'reserve', 'availability', 'available', 'tour', 'visit', 'appointment'],
      answer: '📅 <a href="book.html"><strong>Book a tour</strong></a> to visit in person, or <a href="contact.html"><strong>send an enquiry</strong></a> and we\'ll confirm available dates.'
    },
    {
      keys: ['wedding', 'bride', 'groom', 'ceremony', 'reception', 'married', 'nuptial'],
      answer: '💍 We offer beautiful indoor &amp; outdoor wedding spaces with a dedicated coordinator. <a href="weddings.html">Weddings →</a>'
    },
    {
      keys: ['conference', 'corporate', 'meeting', 'agm', 'workshop', 'training', 'seminar'],
      answer: '💼 Fully equipped conference facilities for meetings, workshops &amp; retreats. <a href="conferences.html">Conferences →</a>'
    },
    {
      keys: ['function', 'birthday', 'anniversary', 'party', 'celebration', 'private event', 'year end'],
      answer: '🎊 We host all kinds of private functions &amp; celebrations. <a href="functions.html">Functions →</a>'
    },
    {
      keys: ['hours', 'open', 'opening', 'time', 'when', 'operating'],
      answer: '🕐 Our team is available <strong>Mon–Sat, 8am–5pm</strong>. For urgent queries, WhatsApp <a href="https://wa.me/263785333222" target="_blank" rel="noopener">+263 785 333 222</a>.'
    },
    {
      keys: ['catering', 'food', 'menu', 'drinks', 'bar', 'kitchen', 'eat'],
      answer: '🍽️ We have an in-house kitchen and can provide catering, or you can bring your own caterer. Contact us to discuss.'
    },
    {
      keys: ['parking', 'park', 'car', 'drive'],
      answer: '🚗 We have ample on-site parking, easily accessible from the Harare–Mutare Highway.'
    },
    {
      keys: ['capacity', 'guests', 'how many', 'people', 'size', 'large', 'small'],
      answer: '👥 We cater from intimate groups of 20 up to <strong>300 guests</strong> in The Grand Hall. Contact us to match your needs.'
    },
    {
      keys: ['hello', 'hi', 'hey', 'morning', 'afternoon', 'howzit', 'greetings'],
      answer: 'Hello! 😊 How can I help? Ask me about location, venues, rates, bookings, or contact details.'
    },
    {
      keys: ['thank', 'thanks', 'cheers', 'appreciate', 'great', 'perfect'],
      answer: 'You\'re welcome! 🙏 Feel free to ask anything else. We look forward to hosting your event!'
    }
  ];

  var FALLBACK = 'I\'m not sure about that. 😊 Please contact us directly — call <a href="tel:+263779222111">+263 779 222 111</a>, <a href="mailto:events@villagardens.co.zw">email us</a>, or <a href="https://wa.me/263785333222" target="_blank" rel="noopener">WhatsApp us</a>.';

  // ---- FUZZY MATCH ----
  // Levenshtein distance for typo tolerance
  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [i];
      for (var j = 1; j <= n; j++) {
        dp[i][j] = i === 0 ? j :
          a[i-1] === b[j-1] ? dp[i-1][j-1] :
          1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  function fuzzyMatch(word, keyword) {
    // Exact substring
    if (keyword.indexOf(word) !== -1 || word.indexOf(keyword) !== -1) return true;
    // Allow 1 typo for words 5+ chars, 2 typos for 8+ chars
    var maxDist = word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0;
    return levenshtein(word, keyword) <= maxDist;
  }

  function getLocalResponse(input) {
    var words = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    var bestScore = 0;
    var bestAnswer = null;

    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      var keys = KB[i].keys;
      for (var w = 0; w < words.length; w++) {
        if (words[w].length < 2) continue;
        for (var k = 0; k < keys.length; k++) {
          // Multi-word key (e.g. "how many")
          var keyWords = keys[k].split(' ');
          if (keyWords.length > 1) {
            if (input.toLowerCase().indexOf(keys[k]) !== -1) score += 3;
          } else {
            if (fuzzyMatch(words[w], keys[k])) score += 2;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestAnswer = KB[i].answer;
      }
    }

    return bestScore >= 2 ? bestAnswer : null;
  }

  // ---- HF INFERENCE API ----
  // Uses a small open-source conversational model as enhancement
  var HF_MODEL = 'facebook/blenderbot-400M-distill';

  // Build a grounded prompt so HF model stays on-topic
  var SYSTEM_CONTEXT = [
    'You are a helpful assistant for Villa Gardens, an events venue in Ruwa, Zimbabwe.',
    'Address: Stand 1234 Villa Gardens, Ruwa, off Harare-Mutare Highway.',
    'Phone: +263 779 222 111. WhatsApp: +263 785 333 222. Email: events@villagardens.co.zw.',
    'Venues: Garden Pavilion, Grand Hall (300 guests), Lapa, Boardroom.',
    'Hours: Mon-Sat 8am-5pm. Rates vary by event — up to 50% off Jan/Feb 2026.',
    'Answer concisely and helpfully.'
  ].join(' ');

  function askHuggingFace(userText, callback) {
    var payload = {
      inputs: {
        past_user_inputs: [],
        generated_responses: [],
        text: SYSTEM_CONTEXT + ' User asks: ' + userText
      },
      parameters: { max_new_tokens: 120 }
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api-inference.huggingface.co/models/' + HF_MODEL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 8000;

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var text = (data.generated_text || (data[0] && data[0].generated_text) || '').trim();
          callback(text || null);
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    xhr.onerror = xhr.ontimeout = function () { callback(null); };
    xhr.send(JSON.stringify(payload));
  }

  // ---- CHAT UI ----
  function addMessage(text, type) {
    var body = document.getElementById('vgChatBody');
    var msg = document.createElement('div');
    msg.className = 'vg-chat__msg vg-chat__msg--' + type;
    msg.innerHTML = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    var body = document.getElementById('vgChatBody');
    var t = document.createElement('div');
    t.className = 'vg-chat__msg vg-chat__msg--bot vg-chat__msg--typing';
    t.id = 'vgTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById('vgTyping');
    if (el) el.parentNode.removeChild(el);
  }

  function handleInput(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    showTyping();

    // Try local fuzzy match first (instant)
    var local = getLocalResponse(text);
    if (local) {
      setTimeout(function () {
        removeTyping();
        addMessage(local, 'bot');
      }, 500);
      return;
    }

    // Fall back to Hugging Face
    askHuggingFace(text, function (hfReply) {
      removeTyping();
      addMessage(hfReply || FALLBACK, 'bot');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle      = document.getElementById('vgChatToggle');
    var chat        = document.getElementById('vgChat');
    var close       = document.getElementById('vgChatClose');
    var input       = document.getElementById('vgChatInput');
    var send        = document.getElementById('vgChatSend');
    var badge       = document.querySelector('.vg-chat__badge');
    var suggestions = document.getElementById('vgSuggestions');

    toggle.addEventListener('click', function () {
      chat.classList.toggle('vg-chat--open');
      if (badge) badge.style.display = 'none';
    });

    close.addEventListener('click', function () {
      chat.classList.remove('vg-chat--open');
    });

    send.addEventListener('click', function () {
      var val = input.value;
      input.value = '';
      if (suggestions) suggestions.style.display = 'none';
      handleInput(val);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var val = input.value;
        input.value = '';
        if (suggestions) suggestions.style.display = 'none';
        handleInput(val);
      }
    });

    if (suggestions) {
      suggestions.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
          var text = e.target.textContent.replace(/^\S+\s/, '').trim();
          suggestions.style.display = 'none';
          handleInput(text);
        }
      });
    }
  });

})();
