'use strict';

const e = React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    const initial_text_a = `ברוכים הבאים למחולל עברית רב־מגדרית!
אתה יכול להחליף את הטקסט בשתי התיבות האלה
בצורות זכר ונקבה של הטקסט שאתה רוצה,
ולקבל את הגרסה הרב־מגדרית.
כך נוכל לפנות לכולם, כי
כל האנשים שוים!`

    const initial_text_b = `ברוכים הבאים למחולל עברית רב־מגדרית!
אתה יכול להחליף את הטקסט בשתי התיבות האלה
בצורות זכר ונקבה של הטקסט שאתה רוצה,
ולקבל את הגרסה הרב־מגדרית.
כך נוכל לפנות לכולם, כי
כל האנשים שוות!`

    this.state = {
      word_a: initial_text_a,
      word_b: initial_text_b,
      add_rev: true,
      output: this.to_multigender_hebrew(initial_text_a, initial_text_b, true)
    };

  }

  to_multigender_hebrew(word_a, word_b, add_rev) {
    const pairsFrom = ["דת", "הו", "הת", "וי", "ית", "םן", "םת", "נת"];
    const pairsTo = ['׬', '׎', '׫', '׊', '׏', '׋', '׉', '׮'];
    const part1 = ['א', 'ת', 'ה'];
    const part2 = ['׭', '׍', '׌'];
    const reduce1 = ['ן', 'ם', 'ך', 'ף'];
    const reduce2 = ['נ', 'מ', 'כ', 'פ'];

    var result = "";
    var i = 0;
    var j = 0;
    var pendingRev = false;
    while (i < word_a.length || j < word_b.length) {
      var resolved = false;
      var char1 = (i < word_a.length) ? word_a[i] : '\0';
      var nextChar1 = (i + 1 < word_a.length) ? word_a[i + 1] : '\0';
      var nextNextChar1 = (i + 2 < word_a.length) ? word_a[i + 2] : '\0';
      var char2 = (j < word_b.length) ? word_b[j] : '\0';
      var nextChar2 = (j + 1 < word_b.length) ? word_b[j + 1] : '\0';
      var nextNextChar2 = (j + 2 < word_b.length) ? word_b[j + 2] : '\0';
      var outputChar = '\0';

      // Yuv
      if (!resolved) {
        if (char1 == 'י' && nextChar1 == 'ו' && char2 == 'י' && nextChar2 != 'ו') {
          outputChar = '׊';
          i += 2;
          j += 1;
          resolved = true;
          pendingRev = true;
        }
        else if (char1 == 'י' && nextChar1 != 'ו' && char2 == 'י' && nextChar2 == 'ו') {
          outputChar = '׊';
          i += 1;
          j += 2;
          resolved = true;
          pendingRev = true;
        }
      }

      //Same letter
      if (!resolved) {

        if (char1 == char2) {
          if (add_rev && pendingRev) {
            result += '׈';
          }

          outputChar = char1;
          i++;
          j++;
          resolved = true;
          pendingRev = false;
        }
        else {
          pendingRev = true;
        }

      }


      //Final and non-final letter
      if (!resolved) {
        for (var k = 0; k < reduce1.length; k++) {
          if (char1 == reduce1[k] && char2 == reduce2[k] || char1 == reduce2[k] && char2 == reduce1[k]) {
            outputChar = reduce2[k];
            i++;
            j++;
            resolved = true;
            break;
          }
        }
      }

      // Yat
      if (!resolved) {
        if (char1 == 'י' && nextChar1 == 'ת' && nextNextChar1 == char2) {
          outputChar = '׏';
          i += 2;
          resolved = true;
        }
        else if (char2 == 'י' && nextChar2 == 'ת' && nextNextChar2 == char1) {
          outputChar = '׏';
          j += 2;
          resolved = true;
        }
      }


      //Partial letter with lookahead
      if (!resolved) {
        for (var k = 0; k < part1.length; k++) {
          if (char1 == part1[k] && nextChar1 == char2) {
            outputChar = part2[k];
            i++;
            resolved = true;
            break;
          }
          if (char2 == part1[k] && nextChar2 == char1) {
            outputChar = part2[k];
            j++;
            resolved = true;
            break;
          }
        }
      }

      //Combined letter
      if (!resolved) {
        var index = -1;
        var combine = [char1, char2];
        combine.sort();
        index = pairsFrom.indexOf(combine.join(''));
        if (index != -1) {
          outputChar = pairsTo[index];
          i++;
          j++;
          resolved = true;
        }
      }

      //Partial letter without lookahead
      if (!resolved) {
        for (var k = 0; k < part1.length; k++) {
          if (char1 == part1[k]) {
            outputChar = part2[k];
            i++;
            resolved = true;
            break;
          }
          if (char2 == part1[k]) {
            outputChar = part2[k];
            j++;
            resolved = true;
            break;
          }
        }
      }


      if (!resolved) {
        return result + "???";
      }

      result = result + outputChar;

    }

    if (add_rev && pendingRev) {
      result += '׈';
    }


    return result;
  }

  transform(evt) {
    var new_state = {
      'word_a': this.state.word_a,
      'word_b': this.state.word_b
    }
    new_state[evt.target.name] = evt.target.value

    new_state.output = this.to_multigender_hebrew(new_state.word_a, new_state.word_b, this.state.add_rev)
    this.setState(new_state);
    return true;
  }

  handle_add_rev_event(evt) {
    this.setState({
      add_rev: evt.target.checked,
      output: this.to_multigender_hebrew(this.state.word_a, this.state.word_b, evt.target.checked)
    })
  }

  render() {
    return e('div', {},
              e('div', { name: 'input' },
                  e('span', {}, 'טקסט א\''),
                  e('textarea', { name: 'word_a', onChange: (evt) => this.transform(evt), value: this.state.word_a }),
                  e('div'),
                  e('span', {}, 'טקסט ב\''),
                  e('textarea', { name: 'word_b', onChange: (evt) => this.transform(evt), value: this.state.word_b }),
                  e('span', {}, ' להוסיף רב (א׈)?'),
                  e('input', { name: 'add_rev', type: 'checkbox', onChange: (evt) => this.handle_add_rev_event(evt), checked: this.state.add_rev }),
                ),

              e('div', {name: 'ouput'}, 
                e('span', {}, 'תוצאה: '),
                e('p', {}, ''),
                e('span', {}, this.state.output),
                )
      
    );
  }
}

const domContainer = document.querySelector('#app_container');
ReactDOM.render(e(App), domContainer);