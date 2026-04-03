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

  // ---- BOOKING FLOW ----
  // Demo timeslots — replace with Google Calendar API later
  var DEMO_SLOTS = {
    monday:    ['10:00am', '2:00pm'],
    tuesday:   ['9:00am', '11:00am', '3:00pm'],
    wednesday: ['10:00am', '1:00pm'],
    thursday:  ['9:00am', '2:00pm', '4:00pm'],
    friday:    ['10:00am', '12:00pm', '3:00pm'],
    saturday:  ['9:00am', '11:00am', '2:00pm']
  };

  var EVENT_TYPES = {
    wedding:    'Wedding',
    conference: 'Conference',
    function:   'Private Function',
    'year end': 'Year-End Function',
    birthday:   'Birthday',
    meeting:    'Meeting',
    tour:       'Venue Tour',
    visit:      'Venue Tour'
  };

  // booking state: null = not in flow
  var booking = null;

  function startBooking() {
    booking = { step: 'event_type' };
    setTimeout(function () {
      addQuickReplies(['💍 Wedding', '💼 Conference', '🎊 Private Function', '🎂 Birthday', '🏛️ Venue Tour']);
    }, 650);
    return '📅 I\'d love to help you book! What type of event are you planning?';
  }

  function getNextWeekDates() {
    var today = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var dates = [];
    // find next Monday
    var diff = (8 - today.getDay()) % 7 || 7;
    for (var i = 0; i < 6; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() + diff + i);
      dates.push({ day: days[d.getDay()], date: d.getDate() + ' ' + d.toLocaleString('default',{month:'long'}) });
    }
    return dates;
  }

  function parseDayFromInput(input) {
    var days = ['monday','tuesday','wednesday','thursday','friday','saturday'];
    for (var i = 0; i < days.length; i++) {
      if (fuzzyMatch(input.toLowerCase().replace(/[^a-z]/g,''), days[i]) ||
          input.toLowerCase().indexOf(days[i]) !== -1) return days[i];
    }
    return null;
  }

  function slotsMsg(day, slots) {
    setTimeout(function () {
      addQuickReplies(slots);
    }, 650);
    return '🗓️ Available slots on <strong>' + cap(day) + '</strong> — tap a time or type your own:';
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function handleBookingStep(input) {
    var lower = input.toLowerCase();

    // -- step: event type --
    if (booking.step === 'event_type') {
      var matched = null;
      for (var k in EVENT_TYPES) {
        if (lower.indexOf(k) !== -1 || fuzzyMatch(lower.replace(/[^a-z]/g,''), k.replace(/[^a-z]/g,''))) {
          matched = EVENT_TYPES[k]; break;
        }
      }
      booking.eventType = matched || cap(input.trim());
      booking.step = 'date';
      setTimeout(function () { addDatePicker(); }, 650);
      return 'Great choice — <strong>' + booking.eventType + '</strong>! 🎉<br><br>Pick a date:';
    }

    // -- step: date (from calendar picker) --
    if (booking.step === 'date') {
      // Calendar sends "Monday 7 April" format
      var dayMatch = parseDayFromInput(input);
      booking.dateStr = input.trim();
      booking.day = dayMatch ? cap(dayMatch) : input.trim();
      booking.step = 'time';
      var slotKey = dayMatch || 'monday';
      var slots = DEMO_SLOTS[slotKey] || DEMO_SLOTS['monday'];
      return slotsMsg(slotKey, slots);
    }

    // -- step: time --
    if (booking.step === 'time') {
      // accept any time-like input
      var timeMatch = input.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i);
      booking.time = timeMatch ? timeMatch[0] : input.trim();
      booking.step = 'guests';
      return 'Perfect — <strong>' + booking.time + '</strong> it is! 👍<br><br>How many guests are you expecting?';
    }

    // -- step: guests --
    if (booking.step === 'guests') {
      var numMatch = input.match(/\d+/);
      booking.guests = numMatch ? numMatch[0] : input.trim();
      booking.step = 'confirm';
      var dateDisplay = (booking.dateStr ? booking.dateStr + ' (' + booking.day + ')' : booking.day) || 'TBC';
      return '✅ Here\'s your booking summary:<br><br>' +
        '• <strong>Event:</strong> ' + booking.eventType + '<br>' +
        '• <strong>Date:</strong> ' + dateDisplay + '<br>' +
        '• <strong>Time:</strong> ' + booking.time + '<br>' +
        '• <strong>Guests:</strong> ' + booking.guests + '<br><br>' +
        'Shall I reserve this slot?';
      setTimeout(function () {
        addQuickReplies(['✅ Yes, confirm', '❌ No, cancel', '📞 Call us instead']);
      }, 650);
      return ret;
    }

    // -- step: confirm --
    if (booking.step === 'confirm') {
      if (lower.indexOf('call us') !== -1 || lower.indexOf('call') !== -1 && lower.indexOf('instead') !== -1) {
        booking = null;
        return '📞 No problem! Give us a call on <a href="tel:+263779222111"><strong>+263 779 222 111</strong></a> or <a href="https://wa.me/263785333222" target="_blank" rel="noopener">WhatsApp us</a> and we\'ll sort everything out. 😊';
      }
      if (lower.indexOf('yes') !== -1 || lower.indexOf('confirm') !== -1 || lower.indexOf('sure') !== -1 || lower.indexOf('ok') !== -1) {
        var b = booking;
        booking = null;
        return '🎉 Wonderful! Your <strong>' + b.eventType + '</strong> on <strong>' + (b.dateStr || b.day) + ' at ' + b.time + '</strong> has been noted.<br><br>' +
          'Our events team will contact you shortly to confirm all the details. You can also reach us at:<br><br>' +
          '📞 <a href="tel:+263779222111">+263 779 222 111</a><br>' +
          '💬 <a href="https://wa.me/263785333222" target="_blank" rel="noopener">WhatsApp us</a><br>' +
          '📧 <a href="mailto:events@villagardens.co.zw">events@villagardens.co.zw</a>';
      }
      if (lower.indexOf('no') !== -1 || lower.indexOf('change') !== -1 || lower.indexOf('cancel') !== -1) {
        booking = null;
        return 'No problem! Let me know if you\'d like to start over or ask something else. 😊';
      }
      return 'Please reply <strong>Yes</strong> to confirm or <strong>No</strong> to cancel. Or <a href="tel:+263779222111">📞 call us</a> for assistance.';
    }

    return null;
  }

  function isBookingIntent(input) {
    var triggers = ['book', 'booking', 'reserve', 'reservation', 'appointment', 'schedule', 'next week', 'want to come', 'plan', 'planning', 'arrange'];
    var lower = input.toLowerCase();
    for (var i = 0; i < triggers.length; i++) {
      if (lower.indexOf(triggers[i]) !== -1) return true;
    }
    return false;
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

  function addQuickReplies(options) {
    var body = document.getElementById('vgChatBody');
    var wrap = document.createElement('div');
    wrap.className = 'vg-chat__quick-replies';
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vg-chat__quick-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        wrap.remove();
        handleInput(opt);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function addDatePicker() {
    var body = document.getElementById('vgChatBody');
    var today = new Date();
    var current = new Date(today.getFullYear(), today.getMonth(), 1);
    var DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var wrap = document.createElement('div');
    wrap.className = 'vg-chat__datepicker';

    function render() {
      wrap.innerHTML = '';
      var year = current.getFullYear();
      var month = current.getMonth();

      // Header
      var header = document.createElement('div');
      header.className = 'vg-dp__header';
      var prev = document.createElement('button');
      prev.type = 'button'; prev.textContent = '‹';
      prev.addEventListener('click', function () {
        current = new Date(year, month - 1, 1); render();
      });
      var next = document.createElement('button');
      next.type = 'button'; next.textContent = '›';
      next.addEventListener('click', function () {
        current = new Date(year, month + 1, 1); render();
      });
      var title = document.createElement('span');
      title.textContent = MONTHS[month] + ' ' + year;
      header.appendChild(prev); header.appendChild(title); header.appendChild(next);
      wrap.appendChild(header);

      // Day labels
      var labels = document.createElement('div');
      labels.className = 'vg-dp__labels';
      DAYS.forEach(function (d) {
        var s = document.createElement('span'); s.textContent = d; labels.appendChild(s);
      });
      wrap.appendChild(labels);

      // Grid
      var grid = document.createElement('div');
      grid.className = 'vg-dp__grid';
      var firstDay = new Date(year, month, 1).getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      for (var i = 0; i < firstDay; i++) {
        var empty = document.createElement('span'); empty.className = 'vg-dp__empty'; grid.appendChild(empty);
      }
      for (var d = 1; d <= daysInMonth; d++) {
        (function(day) {
          var dt = new Date(year, month, day);
          var btn = document.createElement('button');
          btn.type = 'button'; btn.textContent = day;
          btn.className = 'vg-dp__day';
          var isPast = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          var isSun = dt.getDay() === 0;
          if (isPast || isSun) {
            btn.disabled = true; btn.className += ' vg-dp__day--disabled';
          } else {
            btn.addEventListener('click', function () {
              wrap.remove();
              var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
              var formatted = dayNames[dt.getDay()] + ' ' + day + ' ' + MONTHS[month];
              handleInput(formatted);
            });
          }
          grid.appendChild(btn);
        })(d);
      }
      wrap.appendChild(grid);
    }

    render();
    body.appendChild(wrap);
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

    setTimeout(function () {
      removeTyping();

      // Active booking flow — continue it
      if (booking) {
        var reply = handleBookingStep(text);
        addMessage(reply || FALLBACK, 'bot');
        return;
      }

      // Booking intent detected — start flow
      if (isBookingIntent(text)) {
        addMessage(startBooking(), 'bot');
        return;
      }

      // KB fuzzy match
      var local = getLocalResponse(text);
      if (local) {
        addMessage(local, 'bot');
        return;
      }

      // Hugging Face fallback
      showTyping();
      askHuggingFace(text, function (hfReply) {
        removeTyping();
        addMessage(hfReply || FALLBACK, 'bot');
      });
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle      = document.getElementById('vgChatToggle');
    var chat        = document.getElementById('vgChat');
    var close       = document.getElementById('vgChatClose');
    var input       = document.getElementById('vgChatInput');
    var send        = document.getElementById('vgChatSend');
    var badge       = document.querySelector('.vg-chat__badge');
    var suggestions = document.getElementById('vgSuggestions');
    var waFloat     = document.querySelector('.whatsapp-float');

    function setChatOpen(open) {
      chat.classList.toggle('vg-chat--open', open);
      if (waFloat) waFloat.style.display = open ? 'none' : '';
    }

    toggle.addEventListener('click', function () {
      var isOpen = chat.classList.contains('vg-chat--open');
      setChatOpen(!isOpen);
      if (badge) badge.style.display = 'none';
    });

    close.addEventListener('click', function () {
      setChatOpen(false);
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
