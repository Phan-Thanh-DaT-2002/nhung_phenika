package com.neo.core.service;
 
public interface IRootService<T> {

	T create(T entity);

	T retrieve(Long id);

	void update(T entity, Long id);

	void delete(Long id);

}
