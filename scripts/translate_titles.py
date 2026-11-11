# -*- coding: utf-8 -*-
"""Перевод английских titleRu названий уроков на русский (стиль модулей 1–4)."""
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data"

T = {
    "Apologize": "Извинитесь",
    "Arrange auto maintenance": "Договоритесь об обслуживании машины",
    "Ask for and give advice": "Попросите совета и посоветуйте",
    "Ask for things in a softened way": "Попросите что-нибудь мягко",
    "Blame someone": "Сделайте упрек",
    "Buy items you need": "Купите нужные вещи",
    "Catch up at a reunion": "Пообщайтесь на встрече выпускников",
    "Catch up with an old friend": "Пообщайтесь со старым другом",
    "Catch up with old friends, use the past tense": "Пообщайтесь со старыми друзьями, прошедшее время",
    "Collaborate at work": "Сотрудничайте на работе",
    "Comfort somebody, describe past regrets or situations": "Утешьте собеседника, расскажите о сожалениях",
    "Comment on food": "Прокомментируйте еду",
    "Comment on music, express wants and needs": "Прокомментируйте музыку, выразите желания",
    "Comment on sports": "Прокомментируйте спорт",
    "Communicate at work": "Пообщайтесь на работе",
    "Communicate with doctors": "Пообщайтесь с врачом",
    "Confirm information": "Подтвердите информацию",
    "Debunk American clichés": "Развейте американские клише",
    "Describe a day in college": "Опишите день в колледже",
    "Describe a move to the big city": "Опишите переезд в большой город",
    "Describe a trip in nature": "Опишите поездку на природу",
    "Describe a wedding": "Опишите свадьбу",
    "Describe clothes": "Опишите одежду",
    "Describe geography": "Опишите географию",
    "Describe marriage, form the past tense": "Опишите брак, образуйте прошедшее время",
    "Describe nature": "Опишите природу",
    "Describe sleeping habits": "Опишите привычки сна",
    "Describe symptoms": "Опишите симптомы",
    "Describe technology, form verb phrases": "Опишите технологии, составьте словосочетания",
    "Describe traditions": "Опишите традиции",
    "Describe your home": "Опишите ваш дом",
    "Describe your routine": "Опишите ваш распорядок",
    "Discuss a trip in nature": "Обсудите поездку на природу",
    "Discuss cause and effect": "Обсудите причину и следствие",
    "Discuss etiquette": "Обсудите этикет",
    "Discuss hypotheticals": "Обсудите гипотетические ситуации",
    "Discuss moving": "Обсудите переезд",
    "Discuss obligations": "Обсудите обязанности",
    "Discuss opinions": "Обсудите мнения",
    "Discuss party preparation": "Обсудите подготовку к вечеринке",
    "Discuss plans for a work party": "Обсудите планы корпоратива",
    "Discuss potential risks": "Обсудите возможные риски",
    "Discuss relationships": "Обсудите отношения",
    "Discuss social media": "Обсудите соцсети",
    "Discuss sports": "Обсудите спорт",
    "Discuss the environment": "Обсудите экологию",
    "Discuss traveling by plane": "Обсудите путешествие самолётом",
    "Discuss traveling solo": "Обсудите путешествие в одиночку",
    "Discuss your work experience": "Обсудите ваш опыт работы",
    "Discussing medical issues": "Обсудите медицинские вопросы",
    "Eat at a restaurant": "Поужинайте в ресторане",
    "Eat in a restaurant": "Поужинайте в ресторане",
    "Establish contacts": "Заведите знакомства",
    "Exchange gossip/talk about rumors": "Обменяйтесь сплетнями",
    "Explain a complicated situation": "Объясните сложную ситуацию",
    "Express disagreement": "Выразите несогласие",
    "Express fear": "Выразите страх",
    "Express fear, talk about what would have happened": "Выразите страх, расскажите о том, что могло бы случиться",
    "Express frustration": "Выразите досаду",
    "Express good wishes for someone": "Выразите добрые пожелания",
    "Express gratitude": "Выразите благодарность",
    "Express how certain or uncertain you are": "Выразите уверенность или сомнение",
    "Express limitations or caveats": "Выразите ограничения или оговорки",
    "Express opinions": "Выразите мнение",
    "Express preferences": "Выразите предпочтения",
    "Express regret, talk about the future": "Выразите сожаление, поговорите о будущем",
    "Express relief and congratulations": "Выразите облегчение и поздравления",
    "Express surprise": "Выразите удивление",
    "Express wishes": "Выразите пожелания",
    "Give advice": "Дайте совет",
    "Give and get permission": "Дайте и попросите разрешение",
    "Give health advice": "Дайте совет о здоровье",
    "Give reasons and justifications": "Приведите причины и обоснования",
    "Interact at a magic show": "Поучаствуйте в магическом шоу",
    "Lead a conversation": "Ведите разговор",
    "Maintain a conversation": "Поддерживайте разговор",
    "Make announcements": "Сделайте объявления",
    "Make complaints": "Сделайте жалобу",
    "Make conclusions and deductions": "Сделайте выводы",
    "Make plans for a Friday night, form verb phrases": "Спланируйте пятницу вечером, составьте словосочетания",
    "Make plans with friends": "Спланируйте встречу с друзьями",
    "Make suggestions": "Сделайте предложения",
    "Make transactions": "Совершите сделки",
    "Narrate past events": "Расскажите о прошлых событиях",
    "Navigate a trip to a theme park": "Сориентируйтесь в поездке в парк развлечений",
    "Navigate transactions at a garage sale": "Совершите покупки на распродаже",
    "Negotiate at work": "Договоритесь на работе",
    "Negotiate chores with roommates": "Договоритесь о делах с соседями по квартире",
    "Negotiate while shopping": "Торгуйтесь при покупках",
    "Order food delivery": "Закажите доставку еды",
    "Plan a move, repeat what you heard": "Спланируйте переезд, перескажите услышанное",
    "Plan a party": "Спланируйте вечеринку",
    "Plan a trip, express suggestions or possibilities": "Спланируйте поездку, выразите предположения",
    "Politely decline an offer or proposal": "Вежливо отклоните предложение",
    "Predict the weather": "Спрогнозируйте погоду",
    "Present a counter-argument": "Приведите контраргумент",
    "Recount experiences": "Расскажите о пережитом",
    "Recount your latest trip": "Расскажите о последней поездке",
    "Refer to extended family": "Расскажите о родственниках",
    "Reminisce about childhood": "Вспомните детство",
    "Reminisce about the past": "Вспомните прошлое",
    "Report what someone said": "Передайте чьи-то слова",
    "Resolve problems": "Решите проблемы",
    "Respond to a command or request": "Ответьте на просьбу или приказ",
    "Return an item": "Верните товар",
    "Share a secret": "Поделитесь секретом",
    "Share anecdotes": "Поделитесь историями",
    "Share memories, describe past events": "Поделитесь воспоминаниями, опишите прошлые события",
    "Shop for sales": "Сделайте покупки на распродаже",
    "Speculate about mysteries": "Рассуждайте о загадках",
    "Take on a project": "Возьмитесь за проект",
    "Talk about (home) renovations": "Поговорите о ремонте",
    "Talk about Halloween": "Поговорите о Хэллоуине",
    "Talk about a move": "Поговорите о переезде",
    "Talk about a tournament": "Поговорите о турнире",
    "Talk about beauty, use the passive voice": "Поговорите о красоте, пассивный залог",
    "Talk about college": "Поговорите о колледже",
    "Talk about crime": "Поговорите о преступности",
    "Talk about famous people": "Поговорите об известных людях",
    "Talk about food, express hopes and plans": "Поговорите о еде, выразите надежды и планы",
    "Talk about gardening": "Поговорите о садоводстве",
    "Talk about goals": "Поговорите о целях",
    "Talk about historical eras": "Поговорите об исторических эпохах",
    "Talk about history": "Поговорите об истории",
    "Talk about history, describe the distant past": "Поговорите об истории, опишите далёкое прошлое",
    "Talk about household chores": "Поговорите о домашних делах",
    "Talk about how things have changed": "Поговорите о переменах",
    "Talk about interests": "Поговорите об увлечениях",
    "Talk about life at school": "Поговорите о школьной жизни",
    "Talk about mistakes": "Поговорите об ошибках",
    "Talk about movies": "Поговорите о фильмах",
    "Talk about music history, repeat what someone said": "Поговорите об истории музыки, перескажите услышанное",
    "Talk about news": "Поговорите о новостях",
    "Talk about news, use the passive voice": "Поговорите о новостях, пассивный залог",
    "Talk about pastimes": "Поговорите о развлечениях",
    "Talk about places": "Поговорите о местах",
    "Talk about politics": "Поговорите о политике",
    "Talk about professional life": "Поговорите о профессиональной жизни",
    "Talk about relationships": "Поговорите об отношениях",
    "Talk about religion": "Поговорите о религии",
    "Talk about sporting events, explain your plans and opinions": "Поговорите о спортивных событиях, расскажите о планах",
    "Talk about television": "Поговорите о телевидении",
    "Talk about the arts": "Поговорите об искусстве",
    "Talk about the chores": "Поговорите о домашних делах",
    "Talk about the news": "Поговорите о новостях",
    "Talk about the past": "Поговорите о прошлом",
    "Talk about traffic": "Поговорите о пробках",
    "Talk about visiting family, ask questions": "Поговорите о визите к родным, задайте вопросы",
    "Talk about wellness": "Поговорите о здоровом образе жизни",
    "Talk about work": "Поговорите о работе",
    "Talk about your daily commute": "Поговорите о дороге на работу",
    "Talk about your goals": "Поговорите о своих целях",
    "Talk about your health": "Поговорите о своём здоровье",
    "Talk about your home, confirm information": "Поговорите о доме, подтвердите информацию",
    "Talk about your plans for a trip": "Поговорите о планах на поездку",
    "Talk about your studies": "Поговорите об учёбе",
    "Talk in an online meeting": "Поговорите на онлайн-встрече",
    "Tell a fairy tale": "Расскажите сказку",
    "Tell stories around a campfire, use the passive voice": "Расскажите истории у костра, пассивный залог",
    "Tell stories, describe belongings or characteristics": "Расскажите истории, опишите вещи и черты",
    "Understand a guided tour": "Поймите экскурсию с гидом",
    "Understand a local news report": "Поймите местный выпуск новостей",
    "Use the future perfect progressive": "Будущее длительное совершенное время",
    "Use the internet": "Используйте интернет",
    "Use the past perfect passive": "Прошедшее совершенное, пассивный залог",
    "Use the present perfect progressive": "Настоящее длительное совершенное время",
}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    total = 0
    missing = set()
    for path in sorted(DATA.glob("section*.ts")):
        text = path.read_text(encoding="utf-8")
        changed = 0
        for en, ru in T.items():
            old = f"titleRu: '{en}'"
            new = f"titleRu: '{ru}'"
            n = text.count(old)
            if n:
                text = text.replace(old, new)
                changed += n
        path.write_text(text, encoding="utf-8")
        total += changed
        print(f"{path.name}: {changed}")
    # проверка: остались ли английские titleRu
    import re
    for path in sorted(DATA.glob("section*.ts")):
        for m in re.finditer(r"titleRu: '([^']*)'", path.read_text(encoding="utf-8")):
            if re.match(r"^[A-Z][a-z]+( [a-z]+)*$", m.group(1)) and m.group(1) not in T:
                missing.add(m.group(1))
    print(f"всего замен: {total}")
    if missing:
        print("без перевода:", sorted(missing))


if __name__ == "__main__":
    main()
