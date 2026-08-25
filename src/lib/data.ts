import { Collection, Story } from './types';

export const COLLECTIONS: Collection[] = [
  { id: 'unsent', label: 'Unsent', desc: 'Things that were never said.' },
  { id: 'longing', label: 'Longing', desc: 'People, places, and moments we still reach for.' },
  { id: 'remembered', label: 'Remembered', desc: 'Stories someone refuses to let disappear.' },
  { id: 'forgiven', label: 'Forgiven', desc: 'Apologies, reconciliation, and letting go.' },
  { id: 'goodbye', label: 'Goodbye', desc: 'Things written at the end of something.' },
  { id: 'grateful', label: 'Grateful', desc: 'Things someone finally learned to appreciate.' },
  { id: 'becoming', label: 'Becoming', desc: 'Stories about changing into someone new.' },
  { id: 'home', label: 'Home', desc: 'Family, childhood, belonging, and the places that shaped us.' },
];

export const collectionById = (id: string) => COLLECTIONS.find((c) => c.id === id);

export const SEED_STORIES: Story[] = [
  {
    id: 'amore-feast', collection: 'home', emotion: 'AMORE', layout: 'hero',
    title: "You can't eat an apology, but my mom made me a feast.",
    excerpt: '"Kain na," the silent care that healed every argument inside our home.',
    author: 'Mikaela R.', date: 'AUGUST 24, 2026', time: '5:02 AM', readingTime: '3 min read', felt: 341,
    body: [
      "My mother has never once told me she loves me in words. Not on birthdays, not at graduations, not even the day I left for another city with two suitcases and a face I was trying to keep still.",
      "What she says instead is \u201cKain na.\u201d Eat now. She said it the morning after my parents' worst fight, standing over a pan of tocino like nothing had happened. She said it the night I failed a class I swore I wouldn't fail. She says it every single time I come home, before I've even put my bag down.",
      "For years I thought it was avoidance. A way to change the subject without changing anything. It took me leaving the house to understand it was never a deflection. It was the whole sentence.",
      "You can't eat an apology. But you can eat the four dishes she makes only when she's sorry, and somehow, impossibly, that has always been enough to make the argument stop mattering.",
      "I don't think she'll ever say it the way movies say it. But I know what a feast means in our kitchen. I've just never had the language for it until now.",
    ],
  },
  {
    id: 'unsent-number', collection: 'unsent', emotion: 'UNSENT', layout: 'horizontal',
    title: 'I typed "I miss you" into your number for six years before it reached a stranger.',
    excerpt: 'The message never sent. Neither did I, not for a long time.',
    author: 'Anonymous', date: 'AUGUST 2, 2026', time: '11:47 PM', readingTime: '2 min read', felt: 212,
    body: [
      "For six years I kept your number saved under a name that wasn't yours, in case someone saw my phone.",
      "Every few months, usually late, usually after a version of the memory that flatters neither of us, I'd open the thread and type \u201cI miss you.\u201d I never sent it. I don't know what I was practicing for.",
      "Then one night I typed it again, this time on purpose, and pressed send before I could think better of it.",
      "It came back undeliverable. New number, it turns out \u2014 someone else entirely, who texted back a confused \u201cwrong number lol\u201d that somehow closed something six years of silence never could.",
      "I didn't grieve you again. I think I'd already done that a hundred times, one unsent draft at a time.",
    ],
  },
  {
    id: 'unsent-folder', collection: 'unsent', emotion: 'UNSENT', layout: 'small',
    title: "I have a folder called 'Things I'll Say When I'm Braver.'",
    excerpt: 'It has forty-one documents. None of them are finished.',
    author: 'J.', date: 'JULY 19, 2026', time: '1:14 AM', readingTime: '1 min read', felt: 98,
    body: [
      "It's called \u2018Things I'll Say When I'm Braver.\u2019 Forty-one documents. Word counts ranging from nine words to eleven pages.",
      "Most of them are addressed to my father, who is very much alive and one flight away, and who I speak to every Sunday about the weather and never about the year he wasn't around.",
      "I keep telling myself I'm drafting. Really I'm archiving. There's a difference between writing something down and being ready for someone to read it.",
      "Sometimes I open the folder just to remind myself the words already exist somewhere, fully formed, waiting. That has to count for something, even if the only reader, for now, is me.",
    ],
  },
  {
    id: 'longing-table', collection: 'longing', emotion: 'LONGING', layout: 'minimal',
    title: 'I still set the table for two.',
    excerpt: "Habits don't know when to stop loving someone.",
    author: 'Anonymous', date: 'JUNE 30, 2026', time: '7:20 PM', readingTime: '1 min read', felt: 276,
    body: [
      "I still set two plates before I remember. It happens less now, but it still happens \u2014 my hand reaching for the second plate before my mind catches up to the kitchen.",
      "Nobody warns you that the hardest part isn't the big, obvious grief. It's the muscle memory. The habits that outlived the person, or the relationship, or the version of your life where two plates made sense.",
      "I've started leaving the second plate out anyway sometimes. Not because I think anyone's coming. Just because unlearning a kindness felt like a strange thing to rush.",
    ],
  },
  {
    id: 'longing-airport', collection: 'longing', emotion: 'LONGING', layout: 'split',
    title: 'Every airport smells like the year you left.',
    excerpt: 'I still check departures for a flight that already landed without me.',
    author: 'Dani', date: 'JUNE 11, 2026', time: '6:05 AM', readingTime: '2 min read', felt: 154,
    body: [
      "Every airport smells like the year you left. I don't know if it's the coffee or the recycled air or something in my memory doing all the work, but it's instant, every time, no matter the city.",
      "For a while I checked departure boards out of habit, looking for a flight that had already landed a long time ago, without me on it, headed somewhere I never followed.",
      "I don't do that anymore. But I still buy the overpriced coffee at the gate, the same brand, the same order, like keeping the ritual is a way of keeping something else.",
    ],
  },
  {
    id: 'remembered-chess', collection: 'remembered', emotion: 'REMEMBERED', layout: 'horizontal',
    title: 'My grandfather taught me chess by losing on purpose.',
    excerpt: "I didn't understand kindness until I was old enough to beat him for real.",
    author: 'Ramon', date: 'MAY 28, 2026', time: '9:40 PM', readingTime: '2 min read', felt: 189,
    body: [
      "My grandfather taught me chess by losing. On purpose, badly, obviously, for almost a year before I noticed.",
      "I thought I was good. I bragged to my cousins. It wasn't until I played someone else \u2014 someone who actually wanted to win \u2014 that I understood what he'd been doing every Sunday afternoon on that same wooden board.",
      "By the time I was good enough to beat him for real, he let me know that he knew that I knew, and we both laughed about it for an hour. That might be the closest thing to a perfect afternoon I've ever had.",
      "He's gone now. The board is in my apartment, missing one knight. I still don't have the heart to replace it.",
    ],
  },
  {
    id: 'remembered-humming', collection: 'remembered', emotion: 'REMEMBERED', layout: 'typographic',
    title: 'She used to hum while she swept the yard at 6 a.m.',
    excerpt: "I recorded thirty seconds of it once. I still haven't listened back.",
    author: 'Anonymous', date: 'MAY 14, 2026', time: '6:00 AM', readingTime: '1 min read', felt: 301,
    body: [
      "She swept the yard at six every morning, humming something I never learned the name of, in a language I understood better than I spoke.",
      "One morning, half-asleep, I recorded thirty seconds of it on my phone, mostly by accident, mostly just to catch the sound of the broom against the pavement.",
      "I still have the file. I have never once played it back. I think some part of me is saving it for a morning I need it more than I need to protect myself from it.",
    ],
  },
  {
    id: 'forgiven-parking-lot', collection: 'forgiven', emotion: 'FORGIVEN', layout: 'split',
    title: 'I forgave my father in a hospital parking lot, not the hospital room.',
    excerpt: 'Some peace happens where no one is watching.',
    author: 'Anonymous', date: 'APRIL 30, 2026', time: '4:18 PM', readingTime: '2 min read', felt: 167,
    body: [
      "I forgave my father in a hospital parking lot, not the hospital room. Something about the fluorescent lighting inside made it feel performative, like the forgiveness was for the nurses instead of for us.",
      "So I said it in the car, engine off, both of us looking straight ahead at nothing. \u201cI'm not angry anymore.\u201d He didn't say much back. He didn't have to.",
      "Some peace happens exactly where no one is watching, in the most unremarkable rooms \u2014 or in this case, the most unremarkable parking lot in the world.",
    ],
  },
  {
    id: 'forgiven-argument', collection: 'forgiven', emotion: 'FORGIVEN', layout: 'small',
    title: "I finally deleted the argument I'd been replaying for four years.",
    excerpt: 'Not because I forgot it. Because I stopped needing to win it.',
    author: 'K.', date: 'APRIL 9, 2026', time: '10:52 AM', readingTime: '1 min read', felt: 143,
    body: [
      "I replayed the same argument for four years, editing my side of it a little sharper every time, like I was rehearsing for a rematch that was never going to happen.",
      "Then, one ordinary Tuesday, I stopped mid-replay and realized I didn't want to win it anymore. I just wanted my friend back.",
      "I texted her \u2018coffee this week?\u2019 with no context, no apology, no explanation. She said yes in four minutes. Neither of us has mentioned the argument since. I don't think we need to.",
    ],
  },
  {
    id: 'goodbye-drive-safe', collection: 'goodbye', emotion: 'GOODBYE', layout: 'typographic',
    title: 'The last thing you said to me was "drive safe."',
    excerpt: "I've been driving safe for eleven years like it's a promise I owe you.",
    author: 'Anonymous', date: 'MARCH 22, 2026', time: '8:33 PM', readingTime: '1 min read', felt: 398,
    body: [
      "The last thing you ever said to me was \u201cdrive safe.\u201d Not goodbye, not I love you \u2014 just three ordinary words you'd said a thousand times before, that happened to be the last.",
      "I've been driving safe for eleven years since. Full stops. Both hands. Under the limit even when I'm late. It stopped being caution a long time ago. It's a promise I never agreed to keep out loud.",
    ],
  },
  {
    id: 'goodbye-gate', collection: 'goodbye', emotion: 'GOODBYE', layout: 'horizontal',
    title: 'We said goodbye at a gate with bad WiFi and worse timing.',
    excerpt: "I've replayed that hug more than I've replayed any first kiss.",
    author: 'Anonymous', date: 'MARCH 3, 2026', time: '5:47 AM', readingTime: '2 min read', felt: 221,
    body: [
      "We said goodbye at a departure gate with bad WiFi and worse timing, twelve minutes before final boarding, both of us pretending the hug was casual.",
      "You were leaving for a contract abroad, the kind that turns three years into a phone screen and a six-hour time difference. I told you to text when you landed. You did, eighteen hours later, one word: \u201cHere.\u201d",
      "I've replayed that hug more times than I've replayed any first kiss I've ever had. It turns out the ending of things asks for a lot more memory than the beginning does.",
    ],
  },
  {
    id: 'grateful-hands', collection: 'grateful', emotion: 'GRATEFUL', layout: 'split',
    title: "My father's hands are rough because he never let mine be.",
    excerpt: 'I used to be embarrassed by his callouses. Now I trace them like a map.',
    author: 'Anonymous', date: 'FEBRUARY 27, 2026', time: '3:15 PM', readingTime: '2 min read', felt: 255,
    body: [
      "My father's hands are rough in a way that used to embarrass me as a teenager \u2014 the callouses catching on fabric, the nails always a little worn down from work.",
      "He spent almost a decade on job sites overseas so my hands could stay soft enough to type instead of build. I didn't understand that trade until I was old enough to see the shape of it.",
      "Now when he visits, I hold his hand a beat longer than I need to. I'm not embarrassed anymore. I'm doing the math on what those callouses actually paid for.",
    ],
  },
  {
    id: 'grateful-neighbor', collection: 'grateful', emotion: 'GRATEFUL', layout: 'small',
    title: "The neighbor who fed a stranger's kid for a decade never asked for anything back.",
    excerpt: "I found out last year that stranger's kid was me.",
    author: 'L.', date: 'FEBRUARY 8, 2026', time: '12:31 PM', readingTime: '1 min read', felt: 176,
    body: [
      "There was a woman on our street who fed any kid who showed up hungry, no questions, no names required, for over a decade.",
      "I found out last year, entirely by accident, in a conversation about someone else, that one of those kids was me, age seven, more often than my parents ever knew.",
      "I went to thank her. She waved it off like it was nothing, the way people do when the kindness cost them more than they'll ever admit.",
    ],
  },
  {
    id: 'becoming-silence', collection: 'becoming', emotion: 'BECOMING', layout: 'minimal',
    title: "I unlearned my mother's silence one therapy session at a time.",
    excerpt: 'Breaking a cycle is quieter than people make it sound.',
    author: 'Anonymous', date: 'JANUARY 19, 2026', time: '2:00 PM', readingTime: '2 min read', felt: 203,
    body: [
      "I unlearned my mother's silence one Tuesday-afternoon therapy session at a time, which is a much less dramatic process than it sounds.",
      "Nobody warns you that breaking a cycle looks less like a breakthrough and more like a hundred small, unglamorous corrections: saying the uncomfortable thing at dinner, not at 2 a.m. through a wall.",
      "I'm not finished. I don't think anyone actually finishes. But I said something hard out loud last week, at a normal volume, in daylight, and nobody left the room. That felt like enough for now.",
    ],
  },
  {
    id: 'becoming-city', collection: 'becoming', emotion: 'BECOMING', layout: 'typographic',
    title: 'I moved to a city where nobody knew who I used to be.',
    excerpt: 'It turns out that was the whole point.',
    author: 'R.', date: 'JANUARY 2, 2026', time: '9:09 AM', readingTime: '1 min read', felt: 132,
    body: [
      "I moved to a city where nobody knew who I used to be, which sounds lonelier than it turned out to be.",
      "For the first time, nobody's memory of me was doing the introducing. I got to decide, in real time, what parts of the old version were worth keeping.",
      "It turns out that was the whole point. Not escaping myself. Just finally getting to choose the parts I wanted to bring.",
    ],
  },
  {
    id: 'home-garlic', collection: 'home', emotion: 'HOME', layout: 'horizontal',
    title: 'Home was never the house. It was garlic hitting hot oil at 6 p.m.',
    excerpt: "I didn't know I missed it until I moved somewhere that smelled like nothing.",
    author: 'Anonymous', date: 'DECEMBER 21, 2025', time: '6:00 PM', readingTime: '1 min read', felt: 229,
    body: [
      "Home was never really the house. It was the sound of garlic hitting hot oil at six in the evening, every single day, whether or not there was anything to celebrate.",
      "I didn't know that smell was doing so much work until I moved somewhere that smelled like nothing at all, and the nothing kept me up more than any noise ever could.",
      "Now I make it on purpose sometimes \u2014 garlic and oil, nothing else \u2014 just to fill the apartment with something that feels less like silence.",
    ],
  },
  {
    id: 'home-your-room', collection: 'home', emotion: 'HOME', layout: 'minimal',
    title: "My mother renamed the guest room 'your room' the day I moved out.",
    excerpt: 'She still keeps the door open, like I might forget the way back.',
    author: 'Anonymous', date: 'DECEMBER 3, 2025', time: '8:47 AM', readingTime: '1 min read', felt: 288,
    body: [
      "The day I moved out, my mother renamed the guest room. On the family group chat, she just called it \u2018your room\u2019 like it had never been anything else.",
      "She still keeps the door open a crack, even when I haven't visited in months, like she's leaving the way back lit for me just in case I forget it.",
      "I don't think I'll ever forget it. But I understand now why she keeps the door open anyway.",
    ],
  },
  {
    id: 'remembered-goldfish', collection: 'remembered', emotion: 'CHILDHOOD', layout: 'small',
    title: 'We buried a goldfish with full military honors in a shoebox.',
    excerpt: 'My little brother cried harder for that fish than he did at my wedding.',
    author: 'Anonymous', date: 'NOVEMBER 15, 2025', time: '4:00 PM', readingTime: '1 min read', felt: 411,
    body: [
      "We buried a goldfish named General Tso with full military honors in a repurposed shoebox, complete with a twenty-one-tissue salute.",
      "My little brother, six years old at the time, cried harder at that funeral than he did at my actual wedding fourteen years later. I have never let him forget it.",
      "Sometimes the smallest griefs get the most honest reactions, before we learn to perform composure for the bigger ones. I miss being that unguarded about anything.",
    ],
  },
  {
    id: 'grateful-therapist', collection: 'grateful', emotion: 'GRATEFUL', layout: 'split',
    title: 'I wrote my therapist a thank-you card and cried in the parking lot.',
    excerpt: 'Growth quietly changes what used to hurt.',
    author: 'Anonymous', date: 'OCTOBER 30, 2025', time: '5:30 PM', readingTime: '2 min read', felt: 187,
    body: [
      "I wrote my therapist a thank-you card after our last session and cried in the parking lot before I'd even started the car.",
      "Growth doesn't announce itself the way I expected. There was no single dramatic breakthrough, just a slow, almost boring accumulation of Tuesdays until one day the thing that used to wreck me for a week only stung for an hour.",
      "I don't think I ever properly thanked the version of myself that kept showing up anyway, on the Tuesdays it felt pointless. So the card was for both of them.",
    ],
  },
];
