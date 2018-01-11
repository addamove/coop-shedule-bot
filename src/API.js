const config = require('./config');

module.exports = {
  AskQuestions(bot, peer, message) {
    bot.sendTextMessage(peer, JSON.stringify(config.users));
    const keys = Object.keys(config.users[peer.id].anwsers);
    if (config.users[peer.id].i === 0) {
      bot.sendTextMessage(peer, config.questions[config.users[peer.id].i]);
    } else if (config.users[peer.id].i <= config.questions.length - 1) {
      config.users[peer.id].anwsers[keys[config.users[peer.id].i - 1]] = message.content.text;
      bot.sendTextMessage(peer, config.questions[config.users[peer.id].i]);
    }
    if (config.users[peer.id].i === config.questions.length) {
      config.users[peer.id].anwsers[keys[config.users[peer.id].i - 1]] = message.content.text;
      config.users[peer.id].verified = true;
      bot.sendTextMessage(
        peer,
        `${
          config.users[peer.id].anwsers.nickname
        }, спасибо! Теперь вы сможете получать адресные сообщения и запросы от других участников системы потребительской кооперации. Если Вы допустили ошибку, в любое время напишите мне “Исправить” или просто пришлите мне букву и.`,
      );
    }
    config.users[peer.id].i += 1;
  },
  DefineNewUser(peer) {
    if (typeof config.users[peer.id] === 'undefined') {
      config.users[peer.id] = {
        peer,
        eventNumber: null,
        i: 0,
        verified: false,
        startedButton: true,
        verification: false,
        edit: false,
        editValue: '',
        anwsers: {
          nickname: '',
          fio: '',
          birth: '',
          region: '',
          vacation: '',
          status: '',
          spehre: '',
        },
      };
    }
  },
  IfPeerAdmin(peer) {
    for (let index = 0; index < config.admins.length; index += 1) {
      if (peer.id !== config.admins[index].id) return true;
    }
    return false;
  },
  SelectEditInfo(event, bot) {
    const keys = Object.keys(config.users[event.peer.id].anwsers);
    // отсылаем вопрос под номером кнопки
    bot.sendTextMessage(event.peer, config.questions[keys.indexOf(event.value)]);
    // посылаем в секцию редактирования
    config.users[event.peer.id].edit = true;
    config.users[event.peer.id].editValue = event.value;
  },
  async EditInfo(bot, peer, message) {
    const oldVal = config.users[peer.id].anwsers[config.users[peer.id].editValue];
    config.users[peer.id].anwsers[config.users[peer.id].editValue] = message.content.text;
    /* eslint-disable  */
    await bot.sendTextMessage(
      peer,
      JSON.stringify(
        `Изменили ${
          config.questions[
            Object.keys(config.users[peer.id].anwsers).indexOf(config.users[peer.id].editValue)
          ]
        } с ${oldVal} на ${config.users[peer.id].anwsers[config.users[peer.id].editValue]}`,
      ),
    );
    /* eslint-enable   */
    this.checking(bot, peer);
  },
  greetings(bot, peer) {
    bot.sendInteractiveMessage(
      peer,
      'Добрый день, я автоматизированный помощник, помогу вам заполнить профиль. С заполненным профилем потенциальный партнер найдет вас быстрее и больше людей смогут узнать о ваших услугах. В среднем заполнение профиля занимает не больше 2 минут. Начнем?',
      [
        {
          actions: [
            {
              id: 's',
              widget: {
                type: 'button',
                value: 'start',
                label: 'Заполнить',
              },
            },
          ],
        },
        {
          actions: [
            {
              id: 'l',
              widget: {
                type: 'button',
                value: 'later',
                label: 'Позже',
              },
            },
          ],
        },
      ],
    );
    config.users[peer.id].startedButton = false;
  },
  checking(bot, peer) {
    const keys = Object.keys(config.users[peer.id].anwsers);
    config.questions.forEach((question, i) => {
      bot.sendTextMessage(peer, `• ${question} - ${config.users[peer.id].anwsers[keys[i]]}`);
    });

    config.users[peer.id].verification = true;

    bot.sendInteractiveMessage(peer, 'Сейчас вы можете отправить или отредактировать данные', [
      {
        actions: [
          {
            id: 's',
            widget: {
              type: 'select',
              label: 'Редактировать',
              options: [
                {
                  label: 'Ник',
                  value: 'nickname',
                },
                {
                  label: 'ФИО',
                  value: 'fio',
                },
                {
                  label: 'Дата рождения',
                  value: 'birth',
                },
                {
                  label: 'Регион',
                  value: 'region',
                },
                {
                  label: 'Должность',
                  value: 'vacation',
                },
                {
                  label: 'Статус',
                  value: 'status',
                },
                {
                  label: 'Сфера интересов',
                  value: 'spehre',
                },
              ],
            },
          },
        ],
      },
    ]);
  },
};
