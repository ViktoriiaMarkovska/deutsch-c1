/* ================= ДІАЛОГИ =================
   Коротка сценка: співрозмовник щось каже, треба обрати природну відповідь.
   Хибні варіанти навмисно граматично правильні — помиляєшся не в формі,
   а в тому, що так просто не кажуть. Саме це найважче вловити з підручника.
   формат: сцена | репліка | переклад репліки | правильна | хибні через ~ | чому */
const DLG={};
DLG.A1=`У пекарні|Guten Tag! Was möchten Sie?|Добрий день! Що бажаєте?|Ein Brot, bitte.|Ich heiße Anna.~Es geht mir gut.~Ich wohne hier.|Продавець питає про замовлення — називаєш, що хочеш;
Знайомство|Wie heißt du?|Як тебе звати?|Ich heiße Olena.|Ich bin gut.~Mir geht es gut.~Ich komme.|Питають ім'я — відповідаєш «Ich heiße…»;
На вулиці|Entschuldigung, wo ist der Bahnhof?|Перепрошую, де вокзал?|Geradeaus und dann links.|Ja, bitte.~Ich bin müde.~Um acht Uhr.|Питають напрямок — показуєш дорогу, а не час;
У кафе|Möchten Sie etwas trinken?|Бажаєте щось випити?|Ja, einen Kaffee bitte.|Nein, ich heiße Max.~Es ist kalt.~Ich komme aus Kyjiw.|Пропонують напій — приймаєш або відмовляєшся;
Зустріч|Wie geht es dir?|Як справи?|Danke, gut. Und dir?|Ich heiße Ivan.~Ich bin zwanzig.~Das kostet zehn Euro.|На «як справи» відповідають про самопочуття;
У магазині|Das macht acht Euro fünfzig.|З вас вісім євро п'ятдесят.|Hier, bitte.|Wie geht es dir?~Ich wohne in Berlin.~Wo ist die Toilette?|Назвали суму — платиш;
Телефон|Hallo, wer ist da?|Алло, хто це?|Hier ist Maria.|Ja, gut.~Ich habe Hunger.~Bis morgen.|Питають, хто телефонує — називаєшся;
Прощання|Auf Wiedersehen!|До побачення!|Tschüss, bis bald!|Guten Morgen.~Wie heißt du?~Ich verstehe nicht.|Прощаються — прощаєшся у відповідь;
Час|Wie spät ist es?|Котра година?|Es ist halb drei.|Am Montag.~Ich bin dreißig.~Zehn Euro.|Питають годину, а не дату чи вік;
У гостях|Möchtest du noch Kuchen?|Хочеш ще торта?|Nein danke, ich bin satt.|Ja, ich heiße Anna.~Es ist warm.~Ich gehe nach Hause.|Пропонують добавку — приймаєш або кажеш, що наївся`;
DLG.A2=`У лікаря|Was fehlt Ihnen denn?|На що скаржитесь?|Ich habe seit gestern Kopfschmerzen.|Ich bin Lehrerin.~Mir gefällt die Stadt.~Ich wohne allein.|Лікар питає про скарги — описуєш симптом;
Оренда|Die Wohnung kostet 700 Euro warm.|Квартира коштує 700 євро з комуналкою.|Sind die Nebenkosten da schon dabei?|Ich komme aus Polen.~Das Wetter ist gut.~Ich arbeite viel.|Логічно уточнити, що входить у ціну;
Запізнення|Du kommst aber spät!|Ти таки запізнився!|Tut mir leid, der Bus hatte Verspätung.|Ja, ich bin müde.~Das ist mein Bruder.~Ich mag Kaffee.|На докір відповідають вибаченням і причиною;
Запрошення|Hast du Samstag Zeit?|Маєш час у суботу?|Leider nicht, da arbeite ich.|Ja, es ist kalt.~Ich heiße Petro.~Der Zug fährt um neun.|Питають про вільний час — приймаєш або відмовляєш;
У ресторані|Hat es Ihnen geschmeckt?|Вам смакувало?|Ja, sehr gut. Die Rechnung bitte.|Ich möchte bestellen.~Wo ist der Ausgang?~Ich bin neu hier.|Питають після їжі — хвалиш і просиш рахунок;
На пошті|Möchten Sie das Paket versichern?|Хочете застрахувати посилку?|Nein, das ist nicht nötig.|Ja, ich habe Hunger.~Der Brief ist lang.~Ich wohne hier seit Mai.|Пропонують послугу — погоджуєшся або відмовляєшся;
Сусід|Könnten Sie die Musik leiser machen?|Не могли б ви зробити музику тихіше?|Entschuldigung, natürlich.|Ja, ich höre gern Musik.~Die Wohnung ist groß.~Ich gehe schlafen.|Ввічливе прохання — вибачаєшся й виконуєш;
Вокзал|Der Zug fällt heute leider aus.|Потяг сьогодні скасовано.|Wann fährt denn der nächste?|Ich fahre gern Zug.~Der Bahnhof ist neu.~Ich habe ein Ticket.|Погана новина — питаєш про альтернативу;
Робота|Können Sie am Montag anfangen?|Можете почати в понеділок?|Ja, das passt mir gut.|Ich bin Lehrer.~Die Arbeit ist schwer.~Ich wohne weit.|Питають про дату старту — погоджуєшся;
Покупка|Möchten Sie es umtauschen oder Geld zurück?|Хочете обміняти чи повернути гроші?|Ich hätte lieber das Geld zurück.|Das Hemd ist blau.~Ich kaufe oft hier.~Es ist zu teuer.|Дають вибір із двох — обираєш один`;
DLG.B1=`Співбесіда|Warum haben Sie sich bei uns beworben?|Чому ви подалися саме до нас?|Weil mich Ihre Projekte im Bereich Nachhaltigkeit überzeugt haben.|Ich brauche dringend Geld.~Ich wohne in der Nähe.~Meine Freundin arbeitet hier.|Питають про мотивацію — говориш про компанію, а не про себе;
Конфлікт|Du hast das schon wieder vergessen.|Ти знову про це забув.|Da hast du recht, ich kümmere mich sofort darum.|Das ist nicht mein Problem.~Ich habe viel zu tun.~Du vergisst auch oft.|Визнати й виправити — зріліше, ніж захищатися;
Оренда|Wir haben leider viele Bewerber für die Wohnung.|На квартиру, на жаль, багато охочих.|Was könnte ich tun, um meine Chancen zu verbessern?|Die Wohnung ist zu teuer.~Ich melde mich später.~Das ist ungerecht.|Замість здатися — питаєш, як підвищити шанси;
Лікар|Ich würde Ihnen zu einer Operation raten.|Я порадив би операцію.|Gibt es dazu auch eine Alternative?|Ich habe keine Zeit.~Das klingt teuer.~Ich bin gesund.|Серйозна порада — питаєш про варіанти, а не відмахуєшся;
На роботі|Könnten Sie das bis Freitag schaffen?|Устигнете до п'ятниці?|Ehrlich gesagt wird das knapp, Montag wäre sicherer.|Ja, kein Problem.~Ich weiß nicht.~Fragen Sie jemand anderen.|Чесна оцінка строку цінніша за поспішне «так»;
Дискусія|Ich finde, Autos sollten aus der Innenstadt verschwinden.|Гадаю, авто мають зникнути з центру.|Im Prinzip stimme ich zu, aber wie kämen dann ältere Leute hin?|Das ist Unsinn.~Ich fahre gern Auto.~Ja, genau.|Погоджуєшся частково й додаєш заперечення — так виглядає дискусія;
Банк|Ihr Antrag wurde leider abgelehnt.|Вашу заявку, на жаль, відхилено.|Dürfte ich erfahren, woran es gelegen hat?|Das ist doch unfair.~Ich gehe zu einer anderen Bank.~Schade.|Питаєш причину — це дає шанс виправити;
Скарга|Das Gerät ist nach zwei Wochen kaputtgegangen.|Пристрій зламався за два тижні.|Dann haben Sie natürlich Anspruch auf Reparatur oder Ersatz.|Das kann nicht sein.~Haben Sie den Bon?~Pech gehabt.|Тут доречно назвати право клієнта, а не сумніватися;
Друг|Ich habe meinen Job verloren.|Я втратив роботу.|Das tut mir leid. Willst du darüber reden?|Such dir einen neuen.~Das ist normal heute.~Wie viel hast du verdient?|Спершу співчуття, тоді пропозиція вислухати;
Курс|Sie sind im Kurs oft still.|Ви на курсі часто мовчите.|Ich traue mich noch nicht so recht, aber ich arbeite daran.|Ich verstehe alles.~Der Kurs ist langweilig.~Die anderen reden zu viel.|Чесне пояснення з наміром змінити`;
DLG.B2=`Нарада|Die Zahlen sprechen eindeutig gegen den Vorschlag.|Цифри однозначно проти пропозиції.|Das sehe ich anders — die Stichprobe war zu klein für so eine Aussage.|Sie haben wohl recht.~Das ist mir egal.~Wir sollten abstimmen.|Заперечуєш не думці, а якості даних — так сперечаються по суті;
Переговори|Unter 50 000 können wir nicht gehen.|Нижче 50 тисяч ми не підемо.|Wenn Sie beim Preis bleiben, bräuchten wir längere Zahlungsfristen.|Dann ist es zu teuer.~Gut, einverstanden.~Wir müssen nachdenken.|Не поступаєшся, а обмінюєш поступку на поступку;
Критика|Ihr Bericht war ziemlich oberflächlich.|Ваш звіт був доволі поверховим.|Können Sie mir sagen, welche Stellen Sie konkret meinen?|Das stimmt nicht.~Ich hatte wenig Zeit.~Andere fanden ihn gut.|Просиш конкретики — тільки так критика стає корисною;
Медіа|Diese Studie beweist den Zusammenhang eindeutig.|Це дослідження однозначно доводить зв'язок.|Sie zeigt eine Korrelation — das ist nicht dasselbe wie Kausalität.|Woher kommt die Studie?~Ich glaube das nicht.~Das ist interessant.|Розрізнення кореляції й причинності — ознака рівня B2;
Установа|Dafür sind wir hier leider nicht zuständig.|За це ми, на жаль, не відповідаємо.|Könnten Sie mir sagen, an welche Stelle ich mich wenden muss?|Das ist typisch.~Aber ich war schon dort.~Ich beschwere mich.|Замість обурення — питаєш, куди далі;
Проєкт|Wir liegen drei Wochen hinter dem Zeitplan.|Ми на три тижні відстаємо від графіка.|Dann sollten wir den Umfang reduzieren statt die Frist zu verschieben.|Das schaffen wir schon.~Wer ist schuld daran?~Das war absehbar.|Пропонуєш рішення, а не шукаєш винних;
Дискусія|Man sollte Sozialleistungen deutlich kürzen.|Соціальні виплати варто помітно скоротити.|Bevor wir darüber reden, müssten wir klären, wen das konkret träfe.|Da bin ich dagegen.~Das ist unmenschlich.~Vielleicht haben Sie recht.|Перевести суперечку з гасел на наслідки;
Відгук|Ihre Bewerbung war gut, aber wir haben uns anders entschieden.|Ваша заявка була доброю, та ми обрали інше.|Wäre es möglich, eine kurze Rückmeldung zu bekommen?|Warum denn nicht?~Das ist Ihre Sache.~Danke trotzdem.|Просиш зворотний зв'язок — це те, що дає користь навіть із відмови;
Наука|Die Ergebnisse liegen im Rahmen der Erwartungen.|Результати в межах очікуваного.|Und wie groß war die Streuung zwischen den Messreihen?|Das klingt gut.~Wann publizieren Sie?~Wer hat das finanziert.|Уточнюєш методологію, а не приймаєш висновок на віру;
Право|Der Vertrag läuft automatisch um ein Jahr weiter.|Договір автоматично продовжується на рік.|Bis wann müsste ich denn kündigen, um das zu vermeiden?|Das ist unzulässig.~Ich unterschreibe nicht.~Verstanden.|Питаєш про строк розірвання — практичне й головне питання`;
DLG.C1=`Захист роботи|Ihre Methodik wirkt an einer Stelle angreifbar.|Ваша методика в одному місці видається вразливою.|Das räume ich ein — allerdings ändert es an der Grundtendenz wenig.|Das sehe ich nicht so.~Da haben Sie recht.~Das war nicht meine Absicht.|Визнати слабину й одразу обмежити її вагу — так тримають позицію;
Полеміка|Sie verdrehen mir das Wort im Mund.|Ви перекручуєте мої слова.|Dann habe ich Sie missverstanden — wie war es denn gemeint?|Das habe ich nicht.~Sie waren unklar.~Bleiben wir sachlich.|Гасиш конфлікт, не визнаючи провини й не звинувачуючи;
Переговори|Wir bräuchten das bis Ende der Woche.|Нам це потрібно до кінця тижня.|Machbar wäre es, allerdings nur zulasten der Sorgfalt.|Das geht nicht.~Kein Problem.~Ich versuche es.|Називаєш ціну поспіху — це чесніше за «так» і за «ні»;
Редакція|Der Text ist gut, nur der Einstieg trägt nicht.|Текст добрий, тільки початок не тримає.|Woran genau scheitert er — am Ton oder am Tempo?|Ich schreibe ihn neu.~Mir gefiel er.~Was schlagen Sie vor.|Звужуєш критику до конкретного — і тоді її можна виправити;
Етика|Formal war alles korrekt.|Формально все було правильно.|Das bezweifle ich nicht, nur beantwortet es die eigentliche Frage nicht.|Dann ist es ja gut.~Das sehe ich anders.~Wer sagt das.|Розводиш законність і правильність — типово C1;
Дискурс|Man wird ja wohl noch sagen dürfen, was man denkt.|Та вже ж можна сказати, що думаєш.|Sagen dürfen schon — nur ist Widerspruch dann auch erlaubt.|Natürlich darf man.~Das ist Populismus.~Nein, darf man nicht.|Приймаєш посилку й повертаєш її ж логікою;
Керівництво|Das Team zieht nicht mit.|Команда не тягне разом.|Bevor ich das glaube, würde ich gern hören, woran es aus deren Sicht liegt.|Dann müssen wir umbauen.~Das liegt an der Führung.~Ich rede mit ihnen.|Не приймаєш діагноз без другої сторони;
Публіцистика|Ihr Artikel war ziemlich zugespitzt.|Ваша стаття була доволі загострена.|Das war Absicht — anders wäre das Thema untergegangen.|Das stimmt leider.~Der Redakteur wollte es so.~Finden Sie?|Свідомо береш відповідальність за прийом;
Наука|Ihre Schlussfolgerung geht über die Daten hinaus.|Ваш висновок виходить за межі даних.|Sie ist als Hypothese formuliert, nicht als Befund.|Das ist Interpretation.~Da irren Sie sich.~Ich formuliere es um.|Захищаєшся точністю статусу твердження;
Конфлікт|Ich habe den Eindruck, Sie weichen aus.|У мене враження, що ви уникаєте відповіді.|Der Eindruck täuscht nicht ganz — die Frage ist heikler, als sie klingt.|Das tue ich nicht.~Fragen Sie konkreter.~Was meinen Sie damit.|Часткове визнання обеззброює краще за заперечення`;
const DIALOGS={};
["A1","A2","B1","B2","C1"].forEach(function(l){
  DIALOGS[l]=DLG[l].split(";").map(function(x){
    const p=x.trim().split("|");
    return {scene:p[0],them:p[1],themUk:p[2],ok:p[3],no:p[4].split("~"),why:p[5]};
  });
});
