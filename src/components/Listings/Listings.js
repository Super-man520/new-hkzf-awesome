import React from 'react'
import styles from './listings.module.scss'
class Listing extends React.Component {
  render() {
    let { houseList } = this.props
    return (
      houseList.map(item => (
        <div className={styles.houselist} key={item.houseCode}>
          <div className={styles.houseimg}>
            <img src={`http://localhost:8080${item.houseImg}`} alt="" />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.desc}>{item.desc}</div>
            {/* 标签 */}
            {item.tags.map((tag, index) => {
              const tagClass = `tag${index + 1}`
              return (
                <span key={tag} className={[styles.housetag, styles[tagClass]].join(' ')}>{tag}</span>
              )
            })}
            <div className={styles.houseprice}>
              <span>{item.price}</span>元/月
            </div>
          </div>
        </div>
      ))
    )
  }
}
export default Listing