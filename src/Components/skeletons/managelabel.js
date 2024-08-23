import styles from "./managelabel.module.css"

const SkeletonLoader = () => {
    return (
      <div className={styles.skeletonWrapper}>
        <table>
          <thead>
            <tr className={styles.sticky}>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className={styles.skeletonRow}>
                <td><div className={styles.skeletonCell}></div></td>
                <td><div className={styles.skeletonCell}></div></td>
                <td><div className={styles.skeletonCell}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default SkeletonLoader
  