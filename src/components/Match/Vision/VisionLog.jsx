import React from 'react';
import { threshold, formatSeconds } from 'utility';
import Table from 'components/Table';
import strings from 'lang';

import { heroTd, heroTdColumn } from '../matchColumns';
import styles from './Vision.css';

const durationObserverColor = threshold(0, [121, 241, 370], [styles.red, styles.yelor, styles.green]);
const durationSentryColor = threshold(0, [81, 161, 250], [styles.red, styles.yelor, styles.green]);

const columns = [
  {
    displayName: strings.ward_log_type,
    field: 'type',
  },
  {
    ...heroTdColumn,
    displayName: strings.ward_log_owner,
    sortFn: false,
  },
  {
    center: true,
    displayName: strings.ward_log_entered_at,
    field: 'enter_time',
  },
  {
    center: true,
    displayName: strings.ward_log_left_at,
    field: 'left_time',
  },
  {
    center: true,
    displayName: strings.ward_log_duration,
    field: 'duration',
  },
  {
    displayName: strings.ward_log_killed_by,
    field: 'killer',
  },
];

const generateData = match => (log) => {
  const wardKiller = (log.left && log.left.player1) ? heroTd(match.players[log.left.player1]) : '';
  const duration = log.left ? log.left.time - log.entered.time : '';

  const durationColor = log.type === 'observer' ? durationObserverColor(duration) : durationSentryColor(duration);

  return {
    ...match.players[log.player],
    type: <img height="29" src={`${API_HOST}/apps/dota2/images/items/ward_${log.type}_lg.png`} role="presentation" />,
    enter_time: formatSeconds(log.entered.time),
    left_time: formatSeconds(log.left && log.left.time) || '-',
    duration: <span style={{ color: durationColor }}>{formatSeconds(duration)}</span>,
    killer: wardKiller,
  };
};

export default class VisionLog extends React.Component {
  constructor(props) {
    super(props);

    this.generator = generateData(this.props.match);
  }

  render() {
    return (
      <div className={styles.visionLog}>
        <Table data={this.props.wards.map(this.generator)} columns={columns} />
      </div>
    );
  }
}

VisionLog.defaulProps = {
  width: 600,
};
